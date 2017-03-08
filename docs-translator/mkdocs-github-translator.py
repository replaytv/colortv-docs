import codecs
import os
import re
from os import path

import sys


def parse_notes(string):
    matches = re.finditer(r"!!! note \".*(\n {4}.*)*", string)
    for match in matches:
        unmodified = match.group(0)
        modified = re.sub(r"!!! note \".*", ">**NOTE**\n>", unmodified)
        modified = re.sub(r" {4}", ">", modified)
        string = string.replace(unmodified, modified)
    return string

DOC_FILE_NAME = ""
HEADER_FILE_NAME = ""
if sys.argv[1] == "android":
    DOC_FILE_NAME = "androidTVSDK.md"
    HEADER_FILE_NAME = "android-header"
elif sys.argv[1] == "roku":
    DOC_FILE_NAME = "rokuSdk.md"
    HEADER_FILE_NAME = "roku-header"

SOURCE_FILES_PATH = path.dirname(os.path.realpath(__file__)) + '/../colortv/docs'

DOC_FILE_PATH = SOURCE_FILES_PATH + "/" + DOC_FILE_NAME

OUTPUT_PATH = path.dirname(os.path.realpath(__file__)) + '/output'
if not path.exists(OUTPUT_PATH):
    os.makedirs(OUTPUT_PATH)
OUTPUT_FILE_PATH = OUTPUT_PATH + '/' + DOC_FILE_NAME

HEADER_FILE_PATH = "headers/" + HEADER_FILE_NAME

SAMPLE_APP_MENTION_ANDROID = "\nFor a sample of the correct integration, please refer to our [sample application](https://github.com/color-tv/android-SampleApp)\n"
SAMPLE_APP_MENTION_ANDROID_REPLACE_TEXT = ""
SAMPLE_APP_MENTION_ROKU = "[this repository](https://github.com/color-tv/roku-sdk-demo-channel)"
SAMPLE_APP_MENTION_ROKU_REPLACE_TEXT = "this repository"

with codecs.open(DOC_FILE_PATH, 'r', "utf-8") as doc_file:
    file_string = doc_file.read()
    file_string = file_string.replace(SAMPLE_APP_MENTION_ANDROID, SAMPLE_APP_MENTION_ANDROID_REPLACE_TEXT)
    file_string = file_string.replace(SAMPLE_APP_MENTION_ROKU, SAMPLE_APP_MENTION_ROKU_REPLACE_TEXT)
    file_string = parse_notes(file_string)
    with open(HEADER_FILE_PATH, 'r') as header:
        file_string = header.read() + "\n\n" + file_string
    with codecs.open(OUTPUT_FILE_PATH, 'w', "utf-8") as output_file:
        output_file.write(file_string)
