// ======================================================
// 📦 DATOS DEL SISTEMA (NO-CODE)
// ======================================================
// 👉 ESTE ARCHIVO ES EL ÚNICO QUE SE EDITA PARA:
//    - Agregar áreas
//    - Agregar departamentos
//    - Agregar personas
//    - Cambiar permisos
//
// 👉 NO TOCAR NINGÚN OTRO ARCHIVO
// ======================================================



// ======================================================
// 🧱 ÁREAS (MENÚ PRINCIPAL)
// ======================================================

export const AREAS = [
  { key: "MBC", nombre: "MBC",          orden: 0 },
  { key: "DIR", nombre: "DIRECCION",        orden: 1 },
  { key: "ADM", nombre: "ADMINISTRACION",   orden: 2 },
  { key: "OPS", nombre: "OPERACIONES",      orden: 3 },
  { key: "CH",  nombre: "CAPITAL HUMANO",   orden: 4 },
  { key: "IMG", nombre: "IMAGEN",           orden: 5 },
  { key: "DIS", nombre: "DISEÑO",           orden: 6 },
];

// ======================================================
// 🏢 DEPARTAMENTOS Y SUBDEPARTAMENTOS (IMÁGENES)
// ======================================================

export const DEPARTAMENTOS = [

  // ==================================================
  // 00. GENERAL (RESULTADOS MBC)
  // ==================================================
  {
    area: "MBC",
    nombre: "MANUFACTURERA DE BOTAS CUADRA",
    orden: 1,
    subDeptos: [
      {
        nombre: "Resultados Generales MBC",
        image: "100.png",
        orden: 1,
      },
    ],
  },

  // ==================================================
  // 01. DIRECCIÓN
  // ==================================================

  // -------- DIRECCIÓN / GENERAL --------
  {
    area: "DIR",
    nombre: "Dirección",
    orden: 1,
    subDeptos: [
      {
        nombre: "Resultados Generales Dirección",
        image: "101.png",
        orden: 1,
      },
    ],
  },

  // -------- DIRECCIÓN / EDGAR CARRILLO --------

  {
    area: "DIR",
    nombre: "EDGAR CARRILLO ANTILLON",
    orden: 2,
    subDeptos: [
      {
        nombre: "CARRILLO ANTILLON EDGAR",
        image: "102.png",
        orden: 1,
      },
    ],
  },

  // -------- DIRECCIÓN / COMPRAS --------
  {
    area: "DIR",
    nombre: "Compras",
    orden: 2,
    subDeptos: [
      {
        nombre: "Resultados Generales Compras",
        image: "103.png",
        orden: 1,
     },
      {
        nombre: "MURILLO MEDRANO OSCAR RICARDO",
        image: "104.png",
        orden: 2,
      },
      {
        nombre: "CISNEROS DE REZA VALERIA",
        image: "105.png",
        orden: 3,
      },
      {
        nombre: "RANGEL REYES JUAN PEDRO",
        image: "106.png",
        orden: 4,
      },
    ],
  },

  // -------- DIRECCIÓN / CALIDAD --------
  {
    area: "DIR",
    nombre: "Calidad",
    orden: 3,
    subDeptos: [
      {
        nombre: "Resultados Generales Calidad",
        image: "107.png",
        orden: 1,
      },
      {
        nombre: "HERNANDEZ ZAMBRANO JOSE RAUL",
        image: "108.png",
        orden: 1,
      },
      {
        nombre: "DE HARO CASTILLO VICTOR",
        image: "109.png",
        orden: 1,
      },
    ],
  },

  // -------- DIRECCIÓN / PRODUCTO TERMINADO --------
  {
    area: "DIR",
    nombre: "Producto Terminado",
    orden: 4,
    subDeptos: [
      {
        nombre: "Resultados Generales Producto Terminado",
        image: "110.png",
        orden: 1,
      },
      {
        nombre: "Resultados Generales Centro de Analisis",
        image: "111.png",
        orden: 2,
      },
      {
        nombre: "HERNANDEZ MARTINEZ LUIS FRANCISCO",
        image: "112.png",
        orden: 3,
      },
      {
        nombre: "RAMIREZ LOZANO LUIS ARMANDO",
        image: "113.png",
        orden: 3,
      },
      {
        nombre: "GUERRERO SANCHEZ MIGUEL ANGEL",
        image: "114.png",
        orden: 4,
      },
      {
        nombre: "ZAMBRANO QUIROZ ADRIAN AARON",
        image: "115.png",
        orden: 5,
      },
    ],
  },

  // ==================================================
  // 02. ADMINISTRACION
  // ==================================================

  {
    area: "ADM",
    nombre: "Administración",
    orden: 1,
    subDeptos: [
      {
        nombre: "Resultados Generales Administración",
        image: "201.png",
        orden: 1,
      },
      {
        nombre: "FRANCO BARBA LUCIA",
        image: "202.png",
        orden: 2,
      },
      {
        nombre: "TAPIA GUTIERREZ EMMA EDITH",
        image: "203.png",
        orden: 3,
      },
    ],
  },


  // ==================================================
  // 03. OPERACIONES
  // ==================================================

  // -------- OPERACIONES / GENERAL --------

  {
    area: "OPS",
    nombre: "Operaciones",
    orden: 1,
    subDeptos: [
      {
        nombre: "Resultados Generales Operaciones",
        image: "301.png",
        orden: 1,
      },
    ],
  },

  // -------- OPERACIONES / PAZ LUNA --------

  {
    area: "OPS",
    nombre: "MA. DE LA PAZ LUNA SOTELO",
    orden: 1,
    subDeptos: [
      {
        nombre: "LUNA SOTELO MA. DE LA PAZ",
        image: "302.png",
        orden: 1,
      },
    ],
  },

  // -------- OPERACIONES / PLANTA 1 --------

  {
    area: "OPS",
    nombre: "Planta 1",
    orden: 2,
    subDeptos: [
      {
        nombre: "Resultados Generales Planta 1",
        image: "303.png",
        orden: 1,
      },
      {
        nombre: "ESPINOSA VALADEZ JORGE FABIAN",
        image: "304.png",
        orden: 2,
      },
      {
        nombre: "CORTE",
        image: "305.png",
        orden: 3,
      },
      {
        nombre: "ARRIAGA BARROSO CRUZ ISAAC",
        image: "306.png",
        orden: 4,
      },
      {
        nombre: "LASER",
        image: "307.png",
        orden: 5,
      },
      {
        nombre: "BORDADO",
        image: "308.png",
        orden: 6,
      },
      {
        nombre: "PRELIMINARES",
        image: "309.png",
        orden: 7,
      },
      {
        nombre: "GODINEZ GRIMALDO MA DEL CARMEN",
        image: "310.png",
        orden: 8,
      },
      {
        nombre: "PESPUNTE",
        image: "311.png",
        orden: 9,
      },
      {
        nombre: "ALCALA VALTIERRA JOSE DE LA LUZ",
        image: "312.png",
        orden: 10,
      },
    ],
  },

  // -------- OPERACIONES / PLANTA 2 --------

  {
    area: "OPS",
    nombre: "Planta 2",
    orden: 3,
    subDeptos: [
      {
        nombre: "Resultados Generales Planta 2",
        image: "313.png",
        orden: 1,
      },
      {
        nombre: "AGUIRRE VELASCO JUAN FRANCISCO",
        image: "314.png",
        orden: 2,
      },
      {
        nombre: "MONTADO",
        image: "315.png",
        orden: 3,
      },
      {
        nombre: "CRUZ VILLALPANDO HECTOR FABIAN",
        image: "316.png",
        orden: 4,
      },
      {
        nombre: "ACABADO",
        image: "317.png",
        orden: 5,
      },
      {
        nombre: "RAMIREZ ZUÑIGA MARIO ANTONIO",
        image: "318.png",
        orden: 6,
      },
      {
        nombre: "AVIOS",
        image: "319.png",
        orden: 7,
      },
      {
        nombre: "Ramírez  Rodriguez  Ricardo",
        image: "320.png",
        orden: 8,
      },
      {
        nombre: "ADORNO",
        image: "321.png",
        orden: 9,
      },
      {
        nombre: "GOMEZ SANTIBAÑEZ JOSE MIGUEL ANGEL",
        image: "322.png",
        orden: 10,
      },
      {
        nombre: "REA ORTIZ SUSANA",
        image: "323.png",
        orden: 11,
      },
      {
        nombre: "ALCANTAR LOPEZ CECILIA",
        image: "324.png",
        orden: 12,
      },
    ],
  },

  // -------- OPERACIONES / ACCESORIOS --------

  {
    area: "OPS",
    nombre: "Accesorios",
    orden: 4,
    subDeptos: [
      {
        nombre: "Resultados Generales Accesorios",
        image: "325.png",
        orden: 1,
      },
      {
        nombre: "ACOSTA GARCIA AGUSTIN",
        image: "326.png",
        orden: 2,
      },
      {
        nombre: "CINTOS",
        image: "327.png",
        orden: 3,
      },
      {
        nombre: "HERNANDEZ HERNANDEZ ARTURO",
        image: "328.png",
        orden: 4,
      },
      {
        nombre: "BILLETERAS",
        image: "329.png",
        orden: 5,
      },
      {
        nombre: "BAUTISTA VAZQUEZ JUAN ERIK CRISTOBAL",
        image: "330.png",
        orden: 6,
      },
      {
        nombre: "CHAMARRAS",
        image: "331.png",
        orden: 7,
      },
      {
        nombre: "CASTILLO ESCOBEDO FERNANDO JOSE",
        image: "332.png",
        orden: 8,
      },
      {
        nombre: "BOLSA",
        image: "333.png",
        orden: 9,
      },
      {
        nombre: "CASTILLO AGUILAR JOSE JUAN",
        image: "334.png",
        orden: 10,
      },
    ],
  },
  
  // -------- OPERACIONES / MAQUILAS --------

  {
    area: "OPS",
    nombre: "Maquilas",
    orden: 4,
    subDeptos: [
      {
        nombre: "Resultados Generales Maquilas",
        image: "336.png",
        orden: 1,
      },
      {
        nombre: "RAMOS ALMEIDA CESAR FERNANDO",
        image: "337.png",
        orden: 2,
      }
    ],
  },  

  // -------- OPERACIONES / INGENIERIAS --------

  {
    area: "OPS",
    nombre: "Ingenierías",
    orden: 4,
    subDeptos: [
      {
        nombre: "Resultados Generales Ingenierías",
        image: "338.png",
        orden: 1,
      },
      {
        nombre: "ARENAS HERNANDEZ SERGIO",
        image: "339.png",
        orden: 2,
      }
    ],
  },  

  // -------- OPERACIONES / DESARROLLO --------

  {
    area: "OPS",
    nombre: "Desarrollo",
    orden: 4,
    subDeptos: [
      {
        nombre: "Resultados Generales Desarrollo",
        image: "340.png",
        orden: 1,
      },
      {
        nombre: "MARTINEZ RODRIGUEZ ALMA LIZETTE",
        image: "341.png",
        orden: 2,
      }
    ],
  },  

  // -------- OPERACIONES / MANTENIMIENTO --------
  
  {
    area: "OPS",
    nombre: "Mantenimiento",
    orden: 4,
    subDeptos: [
      {
        nombre: "Resultados Generales Mantenimiento",
        image: "342.png",
        orden: 1,
      },
      {
        nombre: "VILLEGAS GONZALEZ JUAN CARLOS",
        image: "343.png",
        orden: 2,
      }
    ],
  },  

  // ==================================================
  // 04. CAPITAL HUMANO
  // ==================================================

  {
    area: "CH",
    nombre: "Capital Humano",
    orden: 1,
    subDeptos: [
      {
        nombre: "Resultados Generales Capital Humano",
        image: "401.png",
        orden: 1,
      },
      {
        nombre: "SANCHEZ VALLADARES PATRICIA",
        image: "402.png",
        orden: 2,
      },
      {
        nombre: "RODRIGUEZ SALAZAR BLENDA MARIA GUADALUPE",
        image: "403.png",
        orden: 3,
      },
      {
        nombre: "DIAZ PEREZ BRANDON EMMANUEL",
        image: "404.png",
        orden: 4,
      },
      {
        nombre: "MORA AGUIRRE JUAN DE JESUS",
        image: "405.png",
        orden: 5,
      },
    ],
  },

// ==================================================
// 05. IMAGEN
// ==================================================

  {
    area: "IMG",
    nombre: "Imagen",
    orden: 1,
    subDeptos: [
      {
        nombre: "Resultados Generales Imagen",
        image: "501.png",
        orden: 1,
      },
      {
        nombre: "ARRIETA CUADRA DANIELA",
        image: "502.png",
        orden: 2,
      },
      {
        nombre: "URTAZA RUIZ DE ESPARZA MARIANA",
        image: "503.png",
        orden: 3,
      },
    ],
  },


// ==================================================
// 06. DISEÑO
// ==================================================

  {
    area: "DIS",
    nombre: "Diseño",
    orden: 1,
    subDeptos: [
      {
        nombre: "Resultados Generales Diseño",
        image: "601.png",
        orden: 1,
      },
      {
        nombre: "NORMA ALICIA LOPEZ MUÑOZ",
        image: "602.png",
        orden: 2,
      },
    ],
  },

];




// ======================================================
// 👤 USUARIOS Y PERMISOS
// ======================================================

export const USUARIOS = [

  // ==================================================
  // 🔑 NIVEL 1 – VE TODO EL SISTEMA
  // ==================================================
  {
    username: "EDGAR",
    password: "Edgar123",
    nombre: "Edgar Carrillo Antillón",
    role: "NIVEL 1",
    permisos: [],
  },

  // ==================================================
  // 🔑 DIRECCIÓN / COMPRAS
  // ==================================================

  {
    username: "Ricardo",
    password: "Ricardo123",
    nombre: "Oscar Ricardo Murillo Medrano",
    role: "NIVEL 4",
    permisos: [
      "103.png",
      "104.png",
      "105.png",
      "106.png",
    ],
  },

  {
    username: "VALERIA",
    password: "Valeria123",
    nombre: "Valeria Cisneros de Reza",
    role: "NIVEL 5",
    permisos: [
      "105.png",
    ],
  },

  {
    username: "JUAN_PEDRO",
    password: "Juan123",
    nombre: "Juan Pedro Rangel Reyes",
    role: "NIVEL 5",
    permisos: [
      "106.png",
    ],
  },

  // ==================================================
  // 🔑 DIRECCIÓN / CALIDAD
  // ==================================================

  {
    username: "Raul",
    password: "Raul123",
    nombre: "José Raúl Hernández Zambrano",
    role: "NIVEL 4",
    permisos: [
      "107.png",
      "108.png",
      "109.png",
    ],
  },

  {
    username: "Victor",
    password: "Victor123",
    nombre: "Víctor De Haro Castillo",
    role: "NIVEL 5",
    permisos: [
      "109.png",
    ],
  },

  // ==================================================
  // 🔑 DIRECCIÓN / PT
  // ==================================================

  {
    username: "Luis",
    password: "Luis123",
    nombre: "Luis Francisco Hernández Martínez",
    role: "NIVEL 4",
    permisos: [
      "110.png",
      "111.png",
      "112.png",
      "113.png",
      "114.png",
      "115.png",
    ],
  },

  {
    username: "Armando",
    password: "Armando123",
    nombre: "Luis Armando Ramírez Lozano",
    role: "NIVEL 5",
    permisos: [
      "110.png",
      "113.png",
    ],
  },

  {
    username: "Miguel_Angel",
    password: "MiguelAngel123",
    nombre: "Miguel Ángel Guerrero Sánchez",
    role: "NIVEL 4",
    permisos: [
      "110.png",
      "114.png",
    ],
  },

  {
    username: "Adrian",
    password: "Adrian123",
    nombre: "Adrián Aarón Zambrano Quiroz",
    role: "NIVEL 4",
    permisos: [
      "111.png",
      "115.png",
    ],
  },

  // ==================================================
  // 🔑 ADMINISTRACION
  // ==================================================

  {
    username: "Lucia",
    password: "Lucia123",
    nombre: "Lucía Franco Barba",
    role: "NIVEL 3",
    permisos: [
      "201.png",
      "202.png",
      "203.png"
    ],
  },

  {
    username: "Emma",
    password: "Emma123",
    nombre: "Emma Edith Tapia Gutiérrez",
    role: "NIVEL 5",
    permisos: [
      "203.png"
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - GERENCIA
  // ==================================================

  {
    username: "Paz_Luna",
    password: "Paz123",
    nombre: "María de la Paz Luna Sotelo",
    role: "NIVEL 3",
    permisos: [
      "301.png","302.png","303.png","304.png","305.png","306.png","307.png",
      "308.png","309.png","310.png","311.png","312.png","313.png","314.png",
      "315.png","316.png","317.png","318.png","319.png","320.png","321.png",
      "322.png","323.png","324.png","325.png","326.png","327.png","328.png",
      "329.png","330.png","331.png","332.png","333.png","334.png","336.png",
      "337.png","338.png","339.png","340.png","341.png","342.png","343.png",
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - PLANTA 1
  // ==================================================

  {
    username: "Jorge_Espinosa123",
    password: "Jorge123",
    nombre: "Jorge Fabián Espinosa Valadez",
    role: "NIVEL 4",
    permisos: [
      "303.png","304.png","305.png","306.png","307.png",
      "308.png","309.png","310.png","311.png","312.png",
    ],
  },

  // Corte
  {
    username: "Cruz",
    password: "Cruz123",
    nombre: "Cruz Isaac Arriaga Barroso",
    role: "NIVEL 5",
    permisos: [
      "305.png",
      "306.png",
    ],
  },

  // Bordado
  // Láser
  // Preeliminares

  {
    username: "Carmen",
    password: "Carmen123",
    nombre: "María del Carmen Godínez Grimaldo",
    role: "NIVEL 5",
    permisos: [
      "307.png",
      "308.png",
      "309.png",
      "310.png",
    ],
  },

  // Prespunte
  {
    username: "Jose_Alcala",
    password: "Jose123",
    nombre: "José de la Luz Alcalá Valtierra",
    role: "NIVEL 5",
    permisos: [
      "311.png",
      "312.png",
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - PLANTA 2
  // ==================================================

  {
    username: "Juan_Francisco",
    password: "Juan123",
    nombre: "Juan Francisco Aguirre Velasco",
    role: "NIVEL 4",
    permisos: [
      "313.png","314.png","315.png","316.png","317.png","318.png",
      "319.png","320.png","321.png","322.png","323.png","324.png",
    ],
  },

  // Montado
  {
    username: "Hector",
    password: "Hector123",
    nombre: "Héctor Fabián Cruz Villalpando",
    role: "NIVEL 5",
    permisos: [
      "315.png",
      "316.png",
    ],
  },

  // Acabado
  {
    username: "Mario",
    password: "Mario123",
    nombre: "Mario Antonio Ramírez Zúñiga",
    role: "NIVEL 5",
    permisos: [
      "317.png",
      "318.png",
    ],
  },

  // Avíos
  {
    username: "Ricardo_R",
    password: "Ricardo123",
    nombre: "Ricardo Ramírez Rodríguez",
    role: "NIVEL 5",
    permisos: [
      "320.png",
      "321.png",
    ],
  },

  // Adorno
  {
    username: "Jose_Miguel",
    password: "JoseMiguel123",
    nombre: "José Miguel Gómez Santibáñez",
    role: "NIVEL 5",
    permisos: [
      "322.png",
    ],
  },

  {
    username: "Susana",
    password: "Susana123",
    nombre: "Susana Rea Ortiz",
    role: "NIVEL 5",
    permisos: [
      "323.png",
    ],
  },

  {
    username: "Cecilia",
    password: "Cecilia123",
    nombre: "Cecilia Alcántar López",
    role: "NIVEL 5",
    permisos: [
      "324.png",
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - ACCESORIOS
  // ==================================================

  {
    username: "Agustin",
    password: "Agustin123",
    nombre: "Agustín Acosta García",
    role: "NIVEL 4",
    permisos: [
      "325.png","326.png","327.png","328.png","329.png",
      "330.png","331.png","332.png","333.png","334.png",
    ],
  },

  // Cintos
  {
    username: "Arturo",
    password: "Arturo123",
    nombre: "Arturo Hernández Hernández",
    role: "NIVEL 5",
    permisos: [
      "327.png",
      "328.png",
    ],
  },

  // Billeteras
  {
    username: "Juan_Erik",
    password: "Juan123",
    nombre: "Juan Erik Bautista Vázquez",
    role: "NIVEL 5",
    permisos: [
      "329.png",
      "330.png",
    ],
  },

  // Chamarras
  {
    username: "Fernando",
    password: "Fernando123",
    nombre: "Fernando José Castillo Escobedo",
    role: "NIVEL 5",
    permisos: [
      "331.png",
      "332.png",
    ],
  },

  // Bolsas
  {
    username: "Jose_Juan",
    password: "Jose123",
    nombre: "José Juan Castillo Aguilar",
    role: "NIVEL 5",
    permisos: [
      "333.png",
      "334.png",
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - MAQUILAS
  // ==================================================

  {
    username: "Cesar",
    password: "Cesar123",
    nombre: "César Fernando Ramos Almeida",
    role: "NIVEL 4",
    permisos: [
      "336.png",
      "337.png",
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - INGENIERIAS
  // ==================================================

  {
    username: "Sergio",
    password: "Sergio123",
    nombre: "Sergio Arenas Hernández",
    role: "NIVEL 4",
    permisos: [
      "338.png",
      "339.png",
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - DESARROLLO
  // ==================================================

  {
    username: "Alma_Lizette",
    password: "Alma123",
    nombre: "Alma Lizette Martínez Rodríguez",
    role: "NIVEL 4",
    permisos: [
      "340.png",
      "341.png",
    ],
  },

  // ==================================================
  // 🔑 OPERACIONES - MANTENIMIENTO
  // ==================================================

  {
    username: "Juan_Carlos",
    password: "Juan123",
    nombre: "Juan Carlos Villegas González",
    role: "NIVEL 4",
    permisos: [
      "342.png",
      "343.png",
    ],
  },

  // ==================================================
  // 🔑 CAPITAL HUMANO
  // ==================================================

  {
    username: "PATY",
    password: "Patricia123",
    nombre: "Patricia Sánchez Valladares",
    role: "NIVEL 1",
    permisos: [],
  },

  {
    username: "BLENDA",
    password: "Blenda123",
    nombre: "Blenda María Guadalupe Rodríguez Salazar",
    role: "NIVEL 5",
    permisos: [
      "403.png"
    ],
  },

  {
    username: "BRANDON",
    password: "Brandon123",
    nombre: "Brandon Emmanuel Díaz Pérez",
    role: "NIVEL 5",
    permisos: [
      "404.png"
    ],
  },

  {
    username: "MORA",
    password: "Mora123",
    nombre: "Juan de Jesús Mora Aguirre",
    role: "NIVEL 5",
    permisos: [
      "405.png"
    ],
  },

  // ==================================================
  // 🔑 IMAGEN
  // ==================================================

  {
    username: "Daniela",
    password: "Daniela123",
    nombre: "Daniela Arrieta Cuadra",
    role: "NIVEL 3",
    permisos: [
      "501.png",
      "502.png",
      "503.png",
    ],
  },

  {
    username: "Mariana",
    password: "Mariana123",
    nombre: "Mariana Urtaza Ruiz de Esparza",
    role: "NIVEL 5",
    permisos: [
      "503.png"
    ],
  },

  // ==================================================
  // 🔑 DISEÑO
  // ==================================================

  {
    username: "Norma",
    password: "Norma123",
    nombre: "Norma Alicia Muñoz López",
    role: "NIVEL 3",
    permisos: [
      "601.png",
      "602.png",
    ],
  },

];

