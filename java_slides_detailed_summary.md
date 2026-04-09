# Programming with Java (CE 277) - Detailed Summary Notes

Source: Combined slides by Dr. Vincent M. Nofong (2019), 277 pages.

## Course Structure at a Glance

1. Introduction to Computers and Java (around p4-p23)
2. Elementary Programming (around p26-p64)
3. Mathematical Functions, Characters and Strings (around p67-p98)
4. Selections and Loops (around p101-p126)
5. Exception Handling and Input/Output (around p129-p160)
6. Data Structures in Java (around p163-p212)
7. Classes and Objects + Methods (around p215-p248)
8. Application Development (Swing/JavaFX) (around p251-p276)

## 1) Introduction to Computers and Java

### Core ideas
- Computer as a programmable electronic system: input, processor, storage, output, and software.
- Abstraction of computer systems and why programming sits between problem and machine.
- Programming language categories, including low-level vs high-level concepts.
- Java positioned as a high-level, general-purpose, object-oriented language.

### Java ecosystem basics
- Java tooling and development flow.
- JDK (Java Development Kit) presented as the core toolkit for compile/run/test.
- Typical editors and IDEs: Eclipse, NetBeans, IntelliJ IDEA, Android Studio, BlueJ, etc.

### Learning outcome
- You should understand where Java fits in the programming landscape and what tools are needed to start coding.

## 2) Elementary Programming

### Variables and declarations
- Variable concepts and naming.
- Scope/types of variables:
  - Local variables
  - Instance variables
  - Static variables
- Data types and declaration rules.
- Common declaration/assignment pitfalls.

### Arithmetic and expressions
- Arithmetic operators and expression construction.
- Operator precedence and evaluation order.
- Numeric data types:
  - Integer types: byte, short, int, long
  - Floating-point types: float, double
- Increment/decrement operators and practical implications.

### Input from keyboard/console
- Reading input with Scanner.
- Data type-sensitive input patterns.
- Typical user-input programming flow.

### Decision making fundamentals
- Equality and relational operators.
- Introductory conditional logic patterns.

### Practicals emphasized
- Debugging/fixing faulty code.
- BMI program:
  - Input weight and height
  - Compute BMI using BMI = weight/(height^2)
  - Classify as underweight/normal/overweight/obese

### Learning outcome
- Build simple interactive programs that read data, compute results, and make basic decisions.

## 3) Mathematical Functions, Characters, and Strings

### Mathematical functions
- Use of Java math functionality.
- Trigonometric functions (sin, cos, tan).
- Attention to radians vs degrees conversion.

### Characters
- Character data type and operations.
- ASCII encoding concepts and character representation.

### Strings
- String as a fundamental reference type.
- String manipulation methods.
- String comparison techniques.
- Substring extraction.
- Conversion between strings and numeric values.

### Practicals emphasized
- Compute/display trigonometric outputs correctly.
- Write programs using string operations for parsing and transformation.

### Learning outcome
- Confident use of text and character handling in addition to numeric operations.

## 4) Selections and Loops

### Selection structures
- if and if-else constructions.
- Multi-way decisions with logical operators.
- switch statements for structured multi-branch logic.

### Loop structures
- while loops.
- do-while loops (body executes before condition check).
- for loops and iteration patterns.

### Problem-solving style
- Building condition-driven and repetition-driven programs.
- Practical exercise examples include classification logic (e.g., Chinese zodiac problem prompt).

### Learning outcome
- Select and implement appropriate control structures based on problem requirements.

## 5) Exception Handling and Input/Output

### Why exception handling
- Build robust, fault-tolerant programs.
- Handle runtime failures gracefully rather than crashing unexpectedly.

### Exception concepts
- Exception categories/types and typical runtime sources.
- try-catch patterns.
- Handling arithmetic exceptions.
- Allowing users to re-enter values after invalid input.
- Handling InputMismatchException from Scanner input.

### File and stream I/O
- File class fundamentals:
  - Inspect file/directory properties
  - Rename/delete files/directories
- Reading from files with Scanner.
- Writing to files with PrintWriter.
- Intro to reading web content with Scanner.

### Practicals emphasized
- Exception-safe user input programs.
- Programs that read from local files and web pages.

### Learning outcome
- Build safer programs with defensive input handling and basic file/data access.

## 6) Data Structures in Java

### Why data structures
- Efficient organization and access of data for larger programs.

### Arrays
- Single-dimensional arrays:
  - Declaration, creation, initialization, access
  - Processing patterns (traversal, aggregation, etc.)
- Multi-dimensional arrays:
  - Structure and use cases
  - Accessing and iterating matrix-like data

### ArrayList
- Dynamic-size collection compared with fixed-size arrays.
- Insertion/removal convenience through methods.
- Typical ArrayList operations and practical exercises.

### Sets
- Concept of uniqueness in collections.
- Set operations and use cases.

### Maps / HashMap
- Key-value storage model.
- Iterating over entries and printing map content.
- Combined use with HashSet in practical contexts.

### Learning outcome
- Choose between arrays, ArrayList, Set, and Map based on problem constraints and data behavior.

## 7) Classes, Objects, OOP, and Methods

### OOP motivation
- Why classes and objects improve modeling and code organization.
- Core object-oriented viewpoint.

### Class and object basics
- What objects are and their features.
- What classes are and how to define them.
- Case study: rectangular box class (data fields + behavior).

### Constructors and references
- Object construction using constructors.
- Reference variables and object access.
- Accessing object data and methods.

### Class design details
- Static variables, constants, and static methods.
- Visibility modifiers.
- Encapsulation of data fields.
- this reference and its purpose.
- Introductory inheritance and polymorphism concepts.

### Methods primer
- Defining methods.
- Calling/invoking methods.
- Refactoring repetitive logic into methods (illustrative sum-in-range examples).

### Learning outcome
- Design simple classes, instantiate objects, and write reusable method-based code in OO style.

## 8) Application Development (Java Swing/JavaFX)

### Tooling and frameworks
- Java tools for application development.
- Java Swing vs JavaFX overview.
- Environment setup in Eclipse for Swing and JavaFX-related workflows.

### Building GUI applications
- Creating Java Swing projects in Eclipse.
- Component placement and property editing.
- Event handling concepts.
- Adding event handlers via IDE workflow.

### Packaging and deployment
- Creating runnable JAR files.
- Creating executables from JAR artifacts.

### Learning outcome
- Move from console programming to basic desktop GUI development and packaging.

## Repeated instructional pattern in the slides

- Topic explanation
- Syntax/pattern demonstration
- Practical exercise
- Reference slides at the end of major modules

This suggests the course is strongly practice-oriented, not purely theoretical.

## High-yield exam/study checklist

1. Write short Java programs using variables, arithmetic, input, and branching.
2. Use strings/chars effectively (compare, substring, parse/convert).
3. Implement loops correctly and choose the right loop type.
4. Use try-catch to handle input and arithmetic errors.
5. Read/write files with Scanner and PrintWriter.
6. Distinguish arrays vs ArrayList vs Set vs HashMap and apply each correctly.
7. Build and use simple classes with constructors, methods, and encapsulation.
8. Explain static vs instance members and visibility modifiers.
9. Describe basic inheritance/polymorphism ideas.
10. Build a simple Swing GUI with an event handler and package it as runnable output.

## Suggested revision strategy

1. Re-implement all practical exercises from scratch.
2. For each chapter, create one mini project that combines at least two chapter concepts.
3. Build one end-to-end capstone:
   - Console input validation with exceptions
   - Data structure usage (ArrayList/HashMap)
   - OO design with classes and methods
   - Optional Swing interface and runnable packaging
