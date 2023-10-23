const questions = [
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the SI unit of electric charge?",
    options: ["Volts", "Coulombs", "Amperes", "Ohms", "Watts"],
    correct_answer: 1,
    explanation:
      "The SI unit of electric charge is the coulomb (C). One coulomb is defined as the charge transported by a constant current of one ampere in one second.",
    subject: "Physics",
    subject_areas: ["Electronics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "Which of the following is an example of a vector quantity?",
    options: ["Speed", "Mass", "Temperature", "Distance", "Velocity"],
    correct_answer: 4,
    explanation:
      "Velocity is a vector quantity because it has both magnitude (speed) and direction. The other options are scalar quantities as they only have magnitude.",
    subject: "Physics",
    subject_areas: ["Mechanics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question:
      "According to Newton's second law of motion, the force acting on an object is equal to the product of its mass and:",
    options: ["Acceleration", "Velocity", "Displacement", "Time", "Inertia"],
    correct_answer: 0,
    explanation:
      "Newton's second law of motion states that F = ma, where F is the force applied to an object, m is its mass, and a is its acceleration.",
    subject: "Physics",
    subject_areas: ["Mechanics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question:
      "Which of the following statements is true about the first law of thermodynamics?",
    options: [
      "Energy cannot be created or destroyed, only transferred.",
      "The total energy of an isolated system remains constant.",
      "Heat always flows from hot to cold objects.",
      "Work done on a system is always converted into kinetic energy.",
      "Entropy in a closed system always decreases.",
    ],
    correct_answer: 1,
    explanation:
      "The first law of thermodynamics, also known as the law of conservation of energy, states that the total energy of an isolated system remains constant. This means that energy can neither be created nor destroyed; it can only change forms.",
    subject: "Physics",
    subject_areas: ["Thermodynamics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "Which type of electromagnetic wave has the highest frequency?",
    options: [
      "Radio waves",
      "Microwaves",
      "Infrared radiation",
      "Ultraviolet light",
      "X-rays",
    ],
    correct_answer: 4,
    explanation:
      "Electromagnetic waves are ordered by increasing frequency, with radio waves having the lowest frequency and X-rays having the highest frequency. X-rays have shorter wavelengths and higher energy than the other options, making them the highest in frequency among these choices.",
    subject: "Physics",
    subject_areas: ["Electromagnetism"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the chemical symbol for the element oxygen?",
    options: ["Ox", "O2", "O", "Oy", "Oi"],
    correct_answer: 2,
    explanation:
      "The chemical symbol for the element oxygen is 'O.' It is commonly found in nature as diatomic oxygen, O2.",
    subject: "Chemistry",
    subject_areas: ["Elements"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "Which gas makes up the majority of Earth's atmosphere?",
    options: ["Carbon dioxide", "Oxygen", "Argon", "Nitrogen", "Methane"],
    correct_answer: 3,
    explanation:
      "Nitrogen makes up approximately 78% of Earth's atmosphere, making it the most abundant gas.",
    subject: "Chemistry",
    subject_areas: ["Atmospheric Chemistry"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the pH of a neutral solution?",
    options: ["7", "0", "14", "1", "10"],
    correct_answer: 0,
    explanation:
      "The pH of a neutral solution is 7. It is neither acidic (pH less than 7) nor basic (pH greater than 7).",
    subject: "Chemistry",
    subject_areas: ["Acids and Bases"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "Which element is the primary component of organic compounds?",
    options: ["Carbon", "Oxygen", "Hydrogen", "Nitrogen", "Sulfur"],
    correct_answer: 0,
    explanation:
      "Carbon is the primary element in organic compounds, forming the backbone of most organic molecules.",
    subject: "Chemistry",
    subject_areas: ["Organic Chemistry"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the chemical formula of water?",
    options: ["H", "O", "HO", "H2O", "OH2"],
    correct_answer: 3,
    explanation:
      "The chemical formula of water is H2O, indicating that each molecule consists of two hydrogen atoms and one oxygen atom.",
    subject: "Chemistry",
    subject_areas: ["Chemical Compounds"],
  },

  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the result of 2 + 2?",
    options: ["3", "4", "5", "6", "7"],
    correct_answer: 1,
    explanation: "The result of 2 + 2 is 4.",
    subject: "Mathematics",
    subject_areas: ["Arithmetic"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the value of π (pi) to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18", "3.20"],
    correct_answer: 1,
    explanation: "The value of π (pi) to two decimal places is 3.14.",
    subject: "Mathematics",
    subject_areas: ["Geometry"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "If x = 5 and y = 3, what is the value of 2x + 3y?",
    options: ["8", "11", "13", "15", "17"],
    correct_answer: 2,
    explanation: "When x = 5 and y = 3, 2x + 3y = 2(5) + 3(3) = 10 + 9 = 19.",
    subject: "Mathematics",
    subject_areas: ["Algebra"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the square root of 144?",
    options: ["9", "10", "12", "14", "16"],
    correct_answer: 2,
    explanation: "The square root of 144 is 12 because 12 * 12 = 144.",
    subject: "Mathematics",
    subject_areas: ["Arithmetic"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "In a right triangle, which side is opposite the right angle?",
    options: [
      "Adjacent side",
      "Hypotenuse",
      "Opposite side",
      "None of the above",
    ],
    correct_answer: 1,
    explanation:
      "In a right triangle, the side opposite the right angle is called the hypotenuse.",
    subject: "Mathematics",
    subject_areas: ["Geometry"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the value of 7 factorial (7!)?",
    options: ["42", "120", "5040", "720", "360"],
    correct_answer: 3,
    explanation:
      "7 factorial (7!) is equal to 7 x 6 x 5 x 4 x 3 x 2 x 1 = 5040.",
    subject: "Mathematics",
    subject_areas: ["Combinatorics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the value of sin(60 degrees) in trigonometry?",
    options: ["0", "0.5", "1", "√3/2", "√2/2"],
    correct_answer: 3,
    explanation: "sin(60 degrees) = √3/2.",
    subject: "Mathematics",
    subject_areas: ["Trigonometry"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "If a circle has a radius of 5 units, what is its circumference?",
    options: ["5π", "10π", "15π", "20π", "25π"],
    correct_answer: 1,
    explanation:
      "The circumference of a circle with radius 'r' is given by 2πr. So, for a radius of 5 units, the circumference is 2π * 5 = 10π units.",
    subject: "Mathematics",
    subject_areas: ["Geometry"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the value of 2^5 (2 raised to the power of 5)?",
    options: ["8", "16", "32", "64", "128"],
    correct_answer: 2,
    explanation: "2^5 = 2 * 2 * 2 * 2 * 2 = 32.",
    subject: "Mathematics",
    subject_areas: ["Algebra"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question:
      "If a rectangle has a length of 8 units and a width of 4 units, what is its area?",
    options: [
      "8 square units",
      "16 square units",
      "24 square units",
      "32 square units",
      "40 square units",
    ],
    correct_answer: 3,
    explanation:
      "The area of a rectangle is given by length × width. So, for a length of 8 units and a width of 4 units, the area is 8 × 4 = 32 square units.",
    subject: "Mathematics",
    subject_areas: ["Geometry"],
  },

  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the SI unit of force?",
    options: ["Volts", "Coulombs", "Amperes", "Ohms", "Newtons"],
    correct_answer: 4,
    explanation:
      "The SI unit of force is the newton (N). One newton is defined as the force required to accelerate a one-kilogram mass by one meter per second squared.",
    subject: "Physics",
    subject_areas: ["Mechanics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "Which scientist is known for the laws of planetary motion?",
    options: [
      "Isaac Newton",
      "Galileo Galilei",
      "Johannes Kepler",
      "Albert Einstein",
      "Niels Bohr",
    ],
    correct_answer: 2,
    explanation:
      "Johannes Kepler is known for his laws of planetary motion, which describe the motion of planets in our solar system.",
    subject: "Physics",
    subject_areas: ["Astrophysics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question: "What is the speed of light in a vacuum?",
    options: [
      "300,000 meters per second",
      "186,000 miles per second",
      "3,000,000 kilometers per second",
      "299,792,458 meters per second",
      "200,000,000 meters per second",
    ],
    correct_answer: 3,
    explanation:
      "The speed of light in a vacuum is approximately 299,792,458 meters per second, often rounded to 300,000 kilometers per second.",
    subject: "Physics",
    subject_areas: ["Electromagnetism"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question:
      "Which of the following materials is an insulator of electricity?",
    options: ["Copper", "Silver", "Rubber", "Aluminum", "Gold"],
    correct_answer: 2,
    explanation:
      "Rubber is an insulator of electricity. It does not conduct electric current and is used as an electrical insulating material.",
    subject: "Physics",
    subject_areas: ["Electronics"],
  },
  {
    points: 1,
    difficulty_level: "Medium",
    question:
      "What is the fundamental force that holds the nucleus of an atom together?",
    options: [
      "Gravitational force",
      "Electromagnetic force",
      "Weak nuclear force",
      "Strong nuclear force",
      "Frictional force",
    ],
    correct_answer: 3,
    explanation:
      "The strong nuclear force is the fundamental force that holds the nucleus of an atom together, overcoming the electrostatic repulsion between positively charged protons.",
    subject: "Physics",
    subject_areas: ["Particle Physics"],
  },
];

const quizzes = [
  {
    course_id: "7bf364c3-883f-47b4-adc4-fe100d192288",
    title: "2023/07/30 - Morning Quiz (Theory Class)",
    subject: "Physics",
    subject_areas: ["Mechanics", "Electromagnetism", "Particle Physics"],
    question_ids: [],
    number_of_questions: 0,
  },
  {
    course_id: "7bf364c3-883f-47b4-adc4-fe100d192288",
    title: "2023/07/30 - Evening Quiz (Theory Class)",
    subject: "Physics",
    subject_areas: ["Electromagnetism"],
    question_ids: [],
    number_of_questions: 0,
  },
  {
    course_id: "7bf364c3-883f-47b4-adc4-fe100d192288",
    title: "2023/08/10 - Morning Quiz (Theory Class)",
    subject: "Physics",
    subject_areas: ["Calculus"],
    question_ids: [],
    number_of_questions: 0,
  },
  {
    course_id: "7bf364c3-883f-47b4-adc4-fe100d192288",
    title: "2023/08/10 - Evening Quiz (Theory Class)",
    subject: "Physics",
    subject_areas: ["Linear Algebra", "Calculus"],
    question_ids: [],
    number_of_questions: 0,
  },
  {
    course_id: "7bf364c3-883f-47b4-adc4-fe100d192288",
    title: "2023/09/05 - Morning Quiz (Theory Class)",
    subject: "Chemistry",
    subject_areas: ["Organic Chemistry", "Inorganic Chemistry"],
    question_ids: [],
    number_of_questions: 0,
  },
];

const categories = [
  {
    title: "Chemical Calculations",
    number_of_questions: 0,
    question_ids: [],
  },
  {
    title: "Revison Questions",
    number_of_questions: 0,
    question_ids: [],
  },
  {
    title: "2018 - Syllabus Questions",
    number_of_questions: 0,
    question_ids: [],
  },
  {
    title: "Mechanics - Revision Questions",
    number_of_questions: 0,
    question_ids: [],
  },
  {
    title: "Industrial Chemistry",
    number_of_questions: 0,
    question_ids: [],
  },
  {
    title: "Organic Questions",
    number_of_questions: 0,
    question_ids: [],
  },
];

const staffs = [
  {
    first_name: "Sithum",
    last_name: "Perera",
    profile_picture:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    NIC: "980756789V",
    DOB: "1998-08-15T18:30:00.000Z",
    address: "No. 12, Main Street, Horana",
    email: "sithum@gmail.com",
    phone_number: "+94 766016862",
    staff_title: "Cls Supporting Staff",
  },
  {
    first_name: "Ravindu",
    last_name: "Samaranayake",
    profile_picture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    NIC: "982756781V",
    DOB: "1998-04-15T18:30:00.000Z",
    address: "No. 12, Main Street, Kalutara",
    email: "ravi@gmail.com",
    phone_number: "+94 766016562",
    staff_title: "Cls Supporting Staff",
  },
  {
    first_name: "Dinuka",
    last_name: "Lakshan",
    profile_picture:
      "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    NIC: "982758781V",
    DOB: "1998-02-15T18:30:00.000Z",
    address: "No. 12, Main Street, Kalutara",
    email: "ravi@gmail.com",
    phone_number: "+94 766016562",
    staff_title: "Cls Supporting Staff",
  },
  {
    first_name: "Wimal",
    last_name: "Perera",
    profile_picture:
      "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    NIC: "962758781V",
    DOB: "1996-02-15T18:30:00.000Z",
    address: "No. 12, Main Street, Kalutara",
    email: "ravi@gmail.com",
    phone_number: "+94 760016522",
    staff_title: "Cls Supporting Staff",
  },
];

module.exports = { questions, quizzes, categories, staffs };
