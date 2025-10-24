"""
CS 246 Lab 8 - Example Python Solution
This file demonstrates how to read and process the lab data files.
"""

import csv
import json
import xml.etree.ElementTree as ET


def read_students_csv(filename):
    """Read student data from CSV file."""
    students = []
    with open(filename, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            students.append(row)
    return students


def read_courses_json(filename):
    """Read course data from JSON file."""
    with open(filename, 'r') as file:
        data = json.load(file)
    return data['courses']


def read_grades_xml(filename):
    """Read grade data from XML file."""
    tree = ET.parse(filename)
    root = tree.getroot()
    
    grades = []
    for student in root.findall('student'):
        student_data = {
            'id': student.get('id'),
            'name': student.find('name').text,
            'final_grade': student.find('.//final_grade').text
        }
        grades.append(student_data)
    return grades


def read_text_file(filename):
    """Read and analyze text file."""
    with open(filename, 'r') as file:
        content = file.read()
    
    # Count non-empty lines
    lines = [line for line in content.split('\n') if line.strip()]
    words = content.split()
    
    return {
        'line_count': len(lines),
        'word_count': len(words),
        'character_count': len(content)
    }


def main():
    """Main function to demonstrate data processing."""
    print("CS 246 Lab 8 - Data Processing Example\n")
    
    # Task 1: Read students
    print("Task 1: Reading students.csv")
    students = read_students_csv('data/students.csv')
    print(f"  Found {len(students)} students")
    print(f"  First student: {students[0]['first_name']} {students[0]['last_name']}\n")
    
    # Task 2: Read courses
    print("Task 2: Reading courses.json")
    courses = read_courses_json('data/courses.json')
    print(f"  Found {len(courses)} courses")
    print(f"  First course: {courses[0]['course_name']}\n")
    
    # Task 3: Read grades
    print("Task 3: Reading grades.xml")
    grades = read_grades_xml('data/grades.xml')
    print(f"  Found {len(grades)} grade records")
    print(f"  First grade: {grades[0]['name']} - {grades[0]['final_grade']}\n")
    
    # Task 4: Analyze text file
    print("Task 4: Analyzing sample.txt")
    stats = read_text_file('data/sample.txt')
    print(f"  Lines: {stats['line_count']}")
    print(f"  Words: {stats['word_count']}")
    print(f"  Characters: {stats['character_count']}")


if __name__ == "__main__":
    main()
