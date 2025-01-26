# MIT License
#
# Copyright (c) 2025 William Hyun
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
# This code is a modified version of a web scraper authored by Sarthak Mangla
# https://github.com/unkn-wn/boilerclasses

import time
import json
import tqdm
import argparse

from selenium import webdriver
from selenium.webdriver.support import ui
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

parser = argparse.ArgumentParser(description='which semester')
parser.add_argument("-sem", default="Spring 2025", dest="sem", help="which semester (default: Spring 2025)")

args = parser.parse_args()

options = Options()
options.add_argument("--headless")
options.add_experimental_option("detach", True)

link = "https://selfservice.mypurdue.purdue.edu/prod/bwckschd.p_disp_dyn_sched"

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# add more here to include other major classes
class_codes = ['CS']
none_found = []

json_data = []

for code in class_codes:
    print(f"parsing {code} courses...")
    driver.get(link)

    dropdown_element = driver.find_element(By.NAME, "p_term")
    dropdown = ui.Select(dropdown_element)
    try:
        dropdown.select_by_visible_text(args.sem)
    except:
        dropdown.select_by_visible_text(f"{args.sem} (View only)")

    xpath_expression = "//input[@type='submit']"
    element = driver.find_element(By.XPATH, xpath_expression)
    element.click()

    time.sleep(1)

    code_dropdown = driver.find_element(By.XPATH, "//select[@name='sel_subj']")
    code_dropdown = ui.Select(code_dropdown)
    try:
        code_dropdown.select_by_value(code)
    except:
        print("no classes found")
        none_found.append(code)
        continue

    campus_dropdown = driver.find_element(By.XPATH, "//select[@name='sel_camp']")
    campus_dropdown = ui.Select(campus_dropdown)
    campus_dropdown.deselect_all()

    # Purdue West Lafayette
    campus_dropdown.select_by_value("PWL")

    class_search_element = driver.find_element(By.XPATH, xpath_expression)
    class_search_element.click()

    time.sleep(3)

    # find the main data display table
    table = driver.find_elements(By.XPATH,
                                 "//table[@summary='This layout table is used to present the sections found']")
    if (len(table) == 0):
        print("no classes found")
        continue

    table = table[0]
    tbody = table.find_element(By.TAG_NAME, "tbody")

    # select all header rows with class information on it
    headers = tbody.find_elements(By.CLASS_NAME, "ddlabel")

    # select all class description bodies
    bodies = tbody.find_elements(By.XPATH, "//td[@class='dddefault' and a[text()='View Catalog Entry']]")
    assert (len(headers) == len(bodies))
    unique_ids = {}
    catalog_entries = {}

    # iterate over all the rows and parse the data
    for i in range(len(headers)):
        class_struct = {
            "title": None,
            "subject_code": None,
            "course_code": None,
            "instructor": None,
            "description": None,
            "time": None,
            "days": None,
            "where": None,
            "specifier": None,
            "date_range": None,
            "capacity": 0,
            "credits": None,
            "term": args.sem,
            "crn": None,
            "sched": None
        }
        curr_header = headers[i]

        # find the line that contains the title
        line = curr_header.find_element(By.TAG_NAME, 'a')
        full_title = line.get_attribute('innerHTML').split(" - ")
        class_struct["title"] = full_title[0]
        curr_crn = int(full_title[-3])
        class_struct["subject_code"] = full_title[-2].split(' ')[0]
        class_struct["course_code"] = full_title[-2].split(' ')[1]
        class_struct["specifier"] = full_title[-1]

        try:
            curr_table = bodies[i].find_element(By.TAG_NAME, "table")
        except:
            continue

        curr_td       = curr_table.find_elements(By.TAG_NAME, "td")[-1]
        sched_type    = curr_table.find_elements(By.TAG_NAME, "td")[-2].text
        date_range_td = curr_table.find_elements(By.TAG_NAME, "td")[-3].text
        where_td      = curr_table.find_elements(By.TAG_NAME, "td")[-4].text
        days_td       = curr_table.find_elements(By.TAG_NAME, "td")[-5].text
        time_td       = curr_table.find_elements(By.TAG_NAME, "td")[-6].text

        # only include primary instructor
        instructors = []
        tmp_instructors = curr_td.text.split(",")
        for j in range(len(tmp_instructors)):
            if ("(P)" in curr_td.text and "(P)" in tmp_instructors[j]) or ("(P)" not in curr_td.text):
                instructors.append(tmp_instructors[j].split("(")[0].strip())

        class_struct["instructor"] = instructors
        class_struct["crn"]        = [curr_crn]
        class_struct["sched"]      = [sched_type]
        class_struct["date_range"] = [date_range_td]
        class_struct["where"]      = [where_td]
        class_struct["time"]       = [time_td]
        class_struct["days"]       = [days_td]
        view_catalog = bodies[i].find_elements(By.TAG_NAME, 'a')[0]
        catalogLink = view_catalog.get_attribute('href')
        catalog_entries[curr_crn] = catalogLink

        unique_ids[curr_crn] = class_struct

    for crn in tqdm(catalog_entries):
        driver.get(catalog_entries[crn])
        bodies_catalog = driver.find_elements(By.CLASS_NAME, "ntdefault")[0]
        desc = bodies_catalog.get_attribute('innerHTML').split("\n")[1]
        unique_ids[crn]["description"] = desc.split(".00.")[-1].strip()
        cred = desc.split('.00.')[0].split(': ')[-1]
        try:
            if "to" in cred:
                unique_ids[crn]["credits"] = [int(float(cred.split(" to ")[0])), int(float(cred.split(" to ")[1]))]
            elif "or" in cred:
                unique_ids[crn]["credits"] = [int(float(cred.split(" or ")[0])), int(float(cred.split(" or ")[1]))]
            else:
                unique_ids[crn]["credits"] = [int(float(cred)), int(float(cred))]
        except:
            unique_ids[crn]["credits"] = [0, 0]

    # clean up strings then add to final json file
    for x in unique_ids:
        unique_ids[x]["title"] = unique_ids[x]["title"].replace("&amp;", "&")
        unique_ids[x]["title"] = unique_ids[x]["title"].replace("&nbsp;", " ")
        unique_ids[x]["title"] = unique_ids[x]["title"].strip()
        unique_ids[x]["description"] = unique_ids[x]["description"].replace("&nbsp;", " ")
        unique_ids[x]["description"] = unique_ids[x]["description"].replace("&amp;", "&")
        unique_ids[x]["description"] = unique_ids[x]["description"].strip()
        json_data.append(unique_ids[x])

sem_name = args.sem.replace(" ", "").lower()
outfile = open(f"classes_{sem_name}.json", "w")
json.dump(json_data, outfile, indent=4)
