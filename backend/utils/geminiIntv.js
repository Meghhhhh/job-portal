// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } = require("@google/generative-ai");

import { GoogleGenerativeAI } from "@google/generative-ai";
  
  const apiKey = process.env.GEMINI_API_KEY_INTV;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", 
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  export async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "You are mock interview taker for me. When i give you input of single skill for eg c or cpp or java etc any such 1 skill it can be any tech skill, you will generate json array of 5 questions for me. ques should be of subjective type testing thorough knowledge of user. \n\nwhen i give u array of projects as i/p you will generate 5 ques in the json format subj type based on what person has worked on. for ex i say i worked on scaling x feature . so u can ask ques related to that\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. I will act as a mock interview taker. You provide me with:\n\n*   **Scenario 1: A Single Technical Skill** (e.g., \"C++\", \"Python\", \"React\", \"SQL\")\n\n*   **Scenario 2: A List/Description of Projects and Your Contributions** (e.g., \"Developed a REST API using Spring Boot\", \"Scaled feature X by implementing caching\", \"Designed a relational database schema for Y\")\n\nBased on your input, I will generate a JSON array containing 5 subjective-type interview questions designed to assess your thorough knowledge.\n\n**Important Considerations:**\n\n*   **Subjective Questions:**  The questions will be open-ended and require you to demonstrate in-depth understanding, problem-solving skills, and experience. I will try to avoid simple \"definition\" questions.\n*   **Real-World Application:** I will tailor the questions to explore how you have applied your knowledge in practical scenarios.\n*   **Deeper Understanding:** The questions will be designed to probe beyond superficial understanding.\n*   **JSON Format:**  The output will be a valid JSON array.\n\nLet's start!  What would you like to start with? A single skill or a project description?\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "for the skills i will also pass along a level like 1,2,3 so esy med hard and based on that keep level of ques accordingly\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. Now I will accept two inputs:\n\n*   **A Single Technical Skill** (e.g., \"C++\", \"Python\", \"React\", \"SQL\")\n*   **Difficulty Level (1-3)**:  1 = Easy, 2 = Medium, 3 = Hard\n\nI will adjust the difficulty of the questions based on the level you provide.\n\nReady when you are. What skill and difficulty level do you want me to use?\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "skill:[c++] level[1]\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question_id\": 1,\n    \"question\": \"Describe the difference between `malloc` and `new` in C++. When would you prefer to use one over the other, and why?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 2,\n    \"question\": \"Explain the concept of pointers in C++. How are they declared and used? Give a simple example.\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 3,\n    \"question\": \"What are the differences between `struct` and `class` in C++? How does the default access specifier differ between the two?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 4,\n    \"question\": \"Describe the purpose of header files in C++. What are they used for, and why are they important for code organization?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 5,\n    \"question\": \"Explain what is meant by pass by value and pass by reference in C++. What are the benefits and drawbacks of each method?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  }\n]\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "alright this is perfect give it in the same json format with this 4 fields always question_id, question, skill, level. always stick to this format no matter what\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Understood. I will adhere strictly to the following JSON format for every response:\n\n```json\n[\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  }\n]\n```\n\nI will ensure each object in the array contains those four fields ( `question_id`, `question`, `skill`, `level`), with the appropriate data types.\n\nOkay, I'm ready for your next skill and level, or the project description.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "project[\"developed rest api using mern stack\", \"worked on auth feature in project\"]\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question_id\": 1,\n    \"question\": \"Describe the overall architecture of the REST API you developed using the MERN stack. What were the key components and how did they interact?\",\n    \"skill\": \"MERN Stack\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 2,\n    \"question\": \"Explain the specific technologies you used for each layer of the MERN stack (MongoDB, Express.js, React, Node.js). What were the main reasons for choosing these technologies over alternatives?\",\n    \"skill\": \"MERN Stack\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 3,\n    \"question\": \"Discuss the authentication methods you implemented for the project. What security considerations did you take into account, and how did you address them?\",\n    \"skill\": \"Authentication\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 4,\n    \"question\": \"Describe any challenges you faced while developing the REST API and/or the authentication feature. How did you overcome them?\",\n    \"skill\": \"Problem Solving\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 5,\n    \"question\": \"How did you handle state management in your React application? Explain your choice of state management library or approach and why it was suitable for this project.\",\n    \"skill\": \"React\",\n    \"level\": 2\n  }\n]\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "be prepared you may get any of such things like as skills properly give questions for them : Compiled Languages: \nA compiled language is a programming language in which we use a compiler to compile and execute our code. the compilers are generally translators that generate machine level code from our written source code. \nExample:\nC\nC++\nC#\nALGOL\nCobol\nFortran\nJava\nVisual Basic\nSmalltalk\nInterpreted Languages: \nAn interpreted language is a programming language in which without compiling a program into machine-language instructions we can execute instructions directly and freely. The interpreter executes the program line by line.Interpreted a language gives many additional flexibility over compiled implementations like, platform independence, dynamic scoping, dynamic typing etc. \nExample: \nPython\nRuby\nPerl\nPascal\nLisp\nBASIC\nAPL\nScripting Languages: \nScripting languages are programming languages that control an application. Scripts which can be executed independently over any other application. They are widely used in the application that they control and are used in automation. \nExample:\nPHP\nVBScript\nWindows PowerShell\nF-Script\nBeanShell\nAutoIt\nR\nGame Maker Language\nMarkup Languages: \nA markup language is an artificial language that used for annotating a document so that it is syntactically distinguishable from the text, the text that define how the text is to be displayed. \nExample: \nHTML\nXML\nXHTML\nSGML\nCurl\nProcedural Languages: \nProcedural (imperative) programming implies specifying the steps that the programs should take to reach to an intended state. A procedure is nothing but a set of instructions that can be referenced through a procedure call. this help in the reuse of code. This type of programming makes the programs structured and easily traceable for program flow. \nExample:\nHyperTalk\nGo\nPL/C\nPL/I\nMATLAB\nCurl\nMathematical\nMATLAB\nFunctional Languages: \nFunctional programming languages define every computation as a mathematical evaluation. They focus on the application of functions.Some of the functional programming languages are pure functional language but many so-called functional languages are impure, containing imperative features, they are not pure function languages. \nExample:\nPure Functional\nAgda\nSAC\nSASL\nCuneiform\nCurry\nFuthark\nHaskell\nImpure Functional languages: \nAPL\nC++ (since C++11)\nC#\nVB.NET\nCeylon\nKotlin\nLisp\nClojure\nJScript\nPHP\nPython\nLogic-based Programming Languages: \nLogic programming is a type of programming paradigm which is largely based on formal logic. logic -based programming are set of sentences in logical form, which express facts and rules about a problem domain. \nExample: \nProlog\nROOP\nALF\nAlma-0\nCurry\nFril\nJanus\nObject-Oriented Languages: \nObject-oriented programming (OOP) is a high-level programming paradigm based on the concept of “objects”, which may contain data, in the form of fields, often known as attributes. In OOP, computer programs binds related data and functions into an object and implements objects and their associated procedures to create software programs. \nExample:\nScala\nC++\nJava\nPython\nC#\nRuby\nScala\nDataflow languages: \nDataflow programming languages rely on representing the flow of data. In a dataflow language, a stream of data gets passed from instruction to instruction for execution. The Conditional execution jumps the data and in procedure calls, it routes the data to a different location. \nExamples: \nAnalytica\nBMDFM\nHartmann pipelines\nLucid\nMax\nOz\nPrograph\nPure Data\nEmbeddable languages: \nIt is mainly dynamic scripting and programming language. it can be also used as a platform-independent general-purpose programming language. Embedded languages are of two types:\nServer Side\nClient Side\nServer-side\nPHP\nVBScript\nSMX\nTcl\nWebDNA\nClient side \nActionScript\nJavaScript\nVBScript\nMachine languages: \nThese languages are directly executable by a compute Central Processing Unit. Machine languages are typically coded in bit patterns, represented in octal or hexadecimal forms. \nExample: \nARM\nDEC\nx86\nIBM System/360\nMIPS\nSun, Oracle SPARC\nSystem languages: \nThese are for low-level languages used in memory management or task management. A system programming language generally used for system programming, for example, languages designed for writing system software, usually require different approaches of development compared to application software. \nExample: \nAda\nNim\nRust\nSwift\nESPOL\nConcurrent Languages: \nThese languages are constructed for concurrency in Message passing languages. For example, Java shows shared-memory concurrency. \nExample: \nGo\nJava\nJulia\nclojure\nScala\nMultiparadigm languages: \nThese types of languages support more than one programming languages or programming paradigm. Multiparadigm languages allow using more than one programming style. No specific language solves all the problems in the easiest or efficient that’s why we use Multiparadigm languages. \nExample: \nAda\nAPL\nBETA\nC++\nC#\nCobra\nExtension languages: \nThese languages are used as an extension to other languages. Extension programming languages are embedded into another program and used to harness its features in extension scripts. \nExample: \nAutoLISP\nBeanShell\nPerl\nPike\nRuby\nIterative languages : \nThese languages are built around or offering generators. \nExample: \nAldor\nAlphard\nPHP\nCLU\nCobra\nHardware description languages: \nThese programming languages are used in electronics, a hardware description language or HDL is used to describe the structure, design, and operation of electronic circuits or digital logic circuits. Among various most popular and well-supported HDL varieties used in industry are Verilog and VHDL. \nExample: \nAnalog circuit’s HDLs:\nVerilog-AMS\nVHDL-AMS\nDigital circuit’s HDLs\nAdvanced Boolean Expression Language(ABEL)\nAltera Hardware Description Language(AHDL)\nBluespec\nLava\nELLA\nVisual languages: \nIn Visual Languages users can specify programs in a 2-D or more way instead one-dimensional (text strings) in visual languages we use graphical elements and figures to develop a program. \nExample: \nAnalytica\nBlockly\nDRAKON\nFabrik\nScratch\nSimulink\nSpreadsheets\nList-based languages: \nList-based languages are based on the list data structure. \nExample: \nLisp\nArc\nClojure\nR\nDylan\nJoy\nSynchronous languages: \nThese programming languages are used in programming reactive systems. A programming reactive systems is the systems which gets interrupted and respond instantly. some of these systems are also called real-time systems and are used widely. \nExample: \nArgus\nAverest\nEsterel\nLustre\nSignal\nMacro languages: \nThese languages are used to transform one source code file into another. Macro is a short piece of text which can expands into a larger one. Macro languages are often used to preprocess the source code. Preprocessors supply facilities like file inclusion etc. \nExample: \ncpp (the C preprocessor)\nm4\nML/I (general purpose macro processor)\nQuery languages: \nThese languages are used in databases and information systems to make queries. \nExample: \nSQL\nXPath\nAQL\nPQL\nXQuery\nMetaprogramming languages: \nMetaprogramming is the writing of programs that write or manipulate other programs, including themselves, as their data or that do part of the work that is otherwise done at run time during compile time. \nExample: \nC++\nCWIC\nCurl\nD\neC\nEmacs Lisp\nElixir\nF#\nRule-based languages: \nRule-based languages instantiate rules when activated by conditions in a set of data. Some set which gets selected and the statements which belonged to those rules get executed. \nExample: \nawk\nCLIPS\nConstraint Handling Rules\nDrools\nJess\nOPS5\nProlog\nNumerical analysis Languages: \nIn Numerical analysis we analyzes and implements algorithms for numerical solutions to solve huge problems of realistic mathematical models involving continuous variables. we use the following programming languages in Numerical Analysis. \nExample: \nMathematical\nMATLAB\nPROSE\nR\nSyntax handling languages: \nThese languages assist with generating lexical analyzers and parsers for context-free grammars.Example: \nANTLR\nCoco/R (EBNF with semantics)\nGNU bison (FSF’s version of Yacc)\nGNU Flex (FSF version of Lex)\nlex (Lexical Analysis, from Bell Labs)\nParsing expression grammar (PEG)\nNon-English-based languages: \nThere are several programming languages which are developed in different language other than the English language. language is not a barrier in this case. \nChinese BASIC – Chinese\nFjölnir – Icelandic\nLanguage Symbolique d’Enseignement – French\nLexico – Spanish\nRapira – Russian\nChaScript-Bengali\nezhil-Tamil\nXML-based languages: \nThese languages are used to transfer XML documents to into human readable format. \nAnt\nC?\nXPath\nXQuery\nXProc\n\nYou may even get tools and techonolgies related to dev-ops like git github docker jenkins etc and related tools\n\ndevelop\nmaintain\ndebug\ntest\ncomputer programs\nProgramming\nProgrammer\nMicrosoft\nMicrosoft Excel\nMS Excel\nMicrosoft Office\nMS Office\nSoftware Development \nHTML\nRetention\nSQL\nModeling\nModelling\nAnalytics\nApache\nApache Airflow\nApache Impala\nApache Drill\nApache Hadoop\nData \nCertification\nData Collection\nDatasets\nBusiness Requirements\nData Mining\nData Science\nVisualization\nTechnical Guidance\nClient Analytics\nProgramming Skills\nSql Server\nComputer Science\nStatistical Modeling\nApplied Data Science\nHiring\t\nTechnical\nDatabase\nEducation\nR\nC\nC++\nC#\nRuby\nRuby on Rails\nWeka\nMatlab\nDjango\nNetBeans\nIDE\nstochastic\nMarketing\nMining\nMathematics\nForecasts\nStatistics\nProgramming\npython\nPython\nMicrosoft Sql Server\nMS Sql Server\nNoSql\nNo-Sql\nHadoop\nSpark\nJava\nAlgorithms\nDatabases\nNumpy\nPandas\nscikit-learn\nScikit\nclustering\nclassification\nneural networks\nneural network\ntensorflow\npytorch\ntheano\nkeras\nPig\nAdaboost\nStatistics\nStatistical analysis\nmachine learning\ndata mining\ndata science\ndata analytics\ndata analysis\nregression\nkmeans\nk-means\nkNN\nBayes\nBayesian Probability\nBayesian Estimation\nBayesian Network\nForest\nRandom Forest\nDecision Tree\nMatrix\nMatrix Factorization\nSVD\nOutlier\nOutlier detection\nRegression Analysis\nFrequent Itemset Mining\nClassification Analysis\nBackpropagation\nSample\nLogitBoost\nTime Series\nStochastic Gradient Descent\nGradient Descent\nPCA\nPrincipal Component Analysis\nDynamic\nDynamic programming\nClustering\nClassification\nData-driven\nAlgorithms\nAnalysis\nAnalytical\nAnalytics\nAnalyze Data\nApplications\nApplication Development\nApplication Development Methodologies\nApplication Development Techniques\nApplication Development Tools\nApplication Programming Interfaces\nAWS\nAWS Glue\nArchitecture\nAROS\nArs Based Programming\nAspect Oriented Programming\nBest Practices\nBrowsers\nCASE Tools\nCapital management\nCode\nCoding\nCollaboration\nCommunication\nComponents\nComputer Platforms\nConcurrent Programming\nComputer Science\nComputational complexity\nConstraint-based Programming\nCustomer Service\nDatabase Management Systems\nDBMS\nDatabase Techniques\nDatabases\nDatabase\nData\nData Analytics\nData Structures\nDebugging\nDesign\nDesign Patterns\nDevelopment\nDevelopment Tools\nDistributed Computing\nDimensionality Reduction\nDocumentation\nEmbedded Hardware\nEmerging Technologies\nFourth Generation Languages\nHardware\nHTML Authoring Tools\nHTML Conversion Tools\nIndustry Systems\niOS\nInformation Systems\nImplementation\nInterface with Clients\nInterface with Vendors\nInternet\nLanguages\nLinux\nLogic\nMacOS\nMath\nMobile\nMultimedia\nMulti-Tasking\nMXNet\nObject oriented programming\nobject oriented\nOperating Systems\nOptimizing\nOrganizational\nOS Programming\nParallel Processing\nPersonal\nPhysics\nPlanning\nPost Object Programming\nPresto\nProblem Solving\nProgramming Languages\nProgramming Methodologies\nQuality Control\nRelational Databases\nRelational Programming\nReporting\nRevision Control\nSelf-Motivation\nSoftware\nStructured Query Language (SQL)\nSymbolic Programming\nSystem Architecture\nSystem Development\nSystem Design\nSystem Programming\nSystem Testing\nTeamwork\nTechnical\nTesting\nThird Generation Languages\nTroubleshooting\nUNIX\nUse Logical Reasoning\nWeb\nWeb Applications\nWeb Platforms\nWeb Services\nWindowing Systems\nWindows\nWorkstations\n\nAny sich skills you may face\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. This is a comprehensive list of potential skills, technologies, and concepts. I will use this information to generate relevant and challenging questions when you provide me with a skill and level, or a project description.\n\nI will still adhere strictly to the JSON format:\n\n```json\n[\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  }\n]\n```\n\nI'm ready for your next input (skill and level, or a project description). Let me know when you're ready.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "you may even face cse fundaments like oops dbms networking os and anything be prepared for all possible related skils\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Understood. I will incorporate fundamental Computer Science concepts such as:\n\n*   **Object-Oriented Programming (OOP):**  Principles, design patterns, advantages, disadvantages.\n*   **Database Management Systems (DBMS):**  Relational vs. NoSQL, database design, normalization, transaction management, indexing.\n*   **Networking:** TCP/IP, OSI model, routing, security protocols.\n*   **Operating Systems (OS):** Process management, memory management, file systems, concurrency, virtualization.\n*   **Data Structures and Algorithms:** Common data structures (arrays, linked lists, trees, graphs) and algorithms (sorting, searching).\n\nI will use this knowledge, combined with the previous list, to create relevant questions. I will prioritize asking questions that require you to apply these concepts in practical scenarios rather than just reciting definitions. And as always, I will stick to the specified JSON format.\n\nReady when you are. What's next?\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "skill: c++"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question_id\": 1,\n    \"question\": \"Explain the concept of RAII (Resource Acquisition Is Initialization) in C++. How does it prevent resource leaks, and provide an example of how you would implement it.\",\n    \"skill\": \"C++\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 2,\n    \"question\": \"Describe the differences between `std::unique_ptr`, `std::shared_ptr`, and `std::weak_ptr` in C++. When would you use each of them, and what problems do they solve?\",\n    \"skill\": \"C++\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 3,\n    \"question\": \"What is polymorphism in C++? Explain the difference between compile-time polymorphism (function overloading, templates) and runtime polymorphism (virtual functions). Give an example of a situation where you would use each.\",\n    \"skill\": \"C++\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 4,\n    \"question\": \"Explain the purpose and benefits of using the Standard Template Library (STL) in C++. Give examples of how you might use containers like `std::vector` or `std::map`, and algorithms like `std::sort` or `std::find`.\",\n    \"skill\": \"C++\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 5,\n    \"question\": \"Describe the potential problems associated with multiple inheritance in C++. How can you mitigate these problems, and what are some alternatives to multiple inheritance?\",\n    \"skill\": \"C++\",\n    \"level\": 2\n  }\n]\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "always give o/p in this json format no matter what. alwys give output in such format it can be parsed by using json.parse. I repeat ALWAYS"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question_id\": 1,\n    \"question\": \"Discuss the trade-offs between using inheritance and composition in object-oriented design. Provide a C++ example where composition might be a better choice than inheritance.\",\n    \"skill\": \"C++\",\n    \"level\": 3\n  },\n  {\n    \"question_id\": 2,\n    \"question\": \"Explain the concept of move semantics in C++11 and later. How does it improve performance, especially when dealing with large objects? Provide an example of a move constructor and move assignment operator.\",\n    \"skill\": \"C++\",\n    \"level\": 3\n  },\n  {\n    \"question_id\": 3,\n    \"question\": \"Describe the potential issues related to exception handling in C++. How can you ensure exception safety in your code, particularly when dealing with resource management?\",\n    \"skill\": \"C++\",\n    \"level\": 3\n  },\n  {\n    \"question_id\": 4,\n    \"question\": \"What are C++ templates, and how do they facilitate generic programming? Explain the difference between template specialization and SFINAE (Substitution Failure Is Not An Error), and give an example of how SFINAE can be used for compile-time dispatch.\",\n    \"skill\": \"C++\",\n    \"level\": 3\n  },\n  {\n    \"question_id\": 5,\n    \"question\": \"Discuss the challenges of writing concurrent C++ code. Explain how you would use threads, mutexes, and condition variables to implement a thread-safe data structure, and describe potential issues like deadlocks and race conditions.\",\n    \"skill\": \"C++\",\n    \"level\": 3\n  }\n]\n```"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    return result.response.text();
  }
  
 // run();
