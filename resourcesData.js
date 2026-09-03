// ==========================================
// EDUDOCENT — BASE DE DATOS DE RECURSOS EDUCATIVOS EXPANDIDA
// Mapeo detallado de temas por materia, grado (6° a 11°), periodo (1 a 4) y tipo de recurso.
// Incluye Educación Inclusiva (PIAR / DUA / Tips Docentes).
// ==========================================

// Iconos de materias (mapa clave → emoji)
export const subjectIcons = {
  espanol_lit: '📖',
  ingles: '🇺🇸',
  sociales: '🌍',
  naturales: '🔬',
  matematicas: '∑',
  tecnologia: '💻',
  historia: '📜',
  estadistica: '📊',
  biblia: '⛪',
  etica: '🤝',
  lectura_critica: '🧐',
  plan_lector: '📚',
  educacion_fisica: '⚽',
  fisica: '⚛️',
  quimica: '🧪',
  artes: '🎨',
  filosofia: '🏛️',
  musica: '🎵',
  emprendimiento: '💼',
  educacion_inclusiva: '🧩'
};

// Mapa de materia.name (como se usa en allSubjects) → materia value (clave interna)
export const subjectNameToValue = {
  'Español y Lit.': 'espanol_lit',
  'Inglés': 'ingles',
  'C. Sociales': 'sociales',
  'C. Naturales': 'naturales',
  'Matemáticas': 'matematicas',
  'Tecnología': 'tecnologia',
  'Historia': 'historia',
  'Estadística': 'estadistica',
  'Biblia': 'biblia',
  'Ética': 'etica',
  'Lectura Crítica': 'lectura_critica',
  'Plan Lector': 'plan_lector',
  'Educación Física': 'educacion_fisica',
  'Física': 'fisica',
  'Química': 'quimica',
  'Artes': 'artes',
  'Filosofía': 'filosofia',
  'Música': 'musica',
  'Emprendimiento': 'emprendimiento'
};

// Lista de opciones para el dropdown del Notebook
export const subjectOptions = [
  { value: 'espanol_lit', label: 'Español y Lit.' },
  { value: 'ingles', label: 'Inglés' },
  { value: 'sociales', label: 'C. Sociales' },
  { value: 'naturales', label: 'C. Naturales' },
  { value: 'matematicas', label: 'Matemáticas' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'historia', label: 'Historia' },
  { value: 'estadistica', label: 'Estadística' },
  { value: 'biblia', label: 'Biblia' },
  { value: 'etica', label: 'Ética' },
  { value: 'lectura_critica', label: 'Lectura Crítica' },
  { value: 'plan_lector', label: 'Plan Lector' },
  { value: 'educacion_fisica', label: 'Educación Física' },
  { value: 'fisica', label: 'Física' },
  { value: 'quimica', label: 'Química' },
  { value: 'artes', label: 'Artes' },
  { value: 'filosofia', label: 'Filosofía' },
  { value: 'musica', label: 'Música' },
  { value: 'emprendimiento', label: 'Emprendimiento' },
  { value: 'educacion_inclusiva', label: '🧩 Educación Inclusiva (PIAR/DUA)', highlight: true }
];

// ==========================================
// MALLAS CURRICULARES DETALLADAS POR GRADO Y PERIODO
// ==========================================

const gradeCurriculum = {
  matematicas: {
    6: {
      1: { title: 'Sistemas Numéricos y Operaciones Básicas', sub: ['Conjunto de números naturales y propiedades', 'Operaciones combinadas sin calculadora', 'Problemas de aplicación contextualizados'] },
      2: { title: 'Teoría de Números y Fraccionarios', sub: ['MCD y mcm con factores primos', 'Concepto de fracción y representación visual', 'Operaciones con fracciones homogéneas y heterogéneas'] },
      3: { title: 'Números Decimales y Porcentajes', sub: ['Conversión de fracciones a decimales', 'Operaciones con números decimales', 'Cálculo de porcentajes simples en la vida diaria'] },
      4: { title: 'Geometría Plana Básica y Perímetros', sub: ['Puntos, líneas, ángulos y polígonos', 'Cálculo de perímetros y áreas de triángulos y cuadriláteros', 'Construcción con regla y compás'] }
    },
    7: {
      1: { title: 'Conjunto de los Números Enteros (Z)', sub: ['La recta numérica y valor absoluto', 'Suma y resta de enteros con signos', 'Multiplicación, división y ley de signos'] },
      2: { title: 'Números Racionales y Razones', sub: ['Representación de racionales en la recta', 'Razones y proporciones simples', 'Regla de tres simple directa e inversa'] },
      3: { title: 'Ecuaciones de Primer Grado con Enteros', sub: ['Lenguaje algebraico elemental', 'Ecuaciones aditivas y multiplicativas', 'Resolución de problemas verbales con ecuaciones'] },
      4: { title: 'Transformaciones en el Plano y Polígonos', sub: ['Plano cartesiano y coordenadas', 'Traslación, rotación y simetría', 'Propiedades de cuadriláteros y circunferencia'] }
    },
    8: {
      1: { title: 'Expresiones Algebraicas y Polinomios', sub: ['Monomios, polinomios y grado absoluto', 'Suma y resta de polinomios', 'Multiplicación de expresiones algebraicas'] },
      2: { title: 'Productos Notables y Factorización I', sub: ['Cuadrado y cubo de un binomio', 'Factor común y agrupación de términos', 'Diferencia de cuadrados perfectos'] },
      3: { title: 'Factorización II y Fracciones Algebraicas', sub: ['Trinomio de la forma x² + bx + c y ax² + bx + c', 'Simplificación de fracciones algebraicas', 'Operaciones con expresiones racionales'] },
      4: { title: 'Geometría Demostrativa y Teorema de Pitágoras', sub: ['Congruencia y semejanza de triángulos', 'Teorema de Pitágoras y aplicaciones', 'Áreas complejas y volumen de prismas'] }
    },
    9: {
      1: { title: 'Función Lineal y Sistemas de Ecuaciones 2x2', sub: ['Pendiente e intersección de la recta', 'Métodos de igualación, sustitución y reducción', 'Resolución gráfica de sistemas 2x2'] },
      2: { title: 'Función Cuadrática y Ecuación de Segundo Grado', sub: ['Vértice y ejes de la parábola', 'Fórmula cuadrática general', 'Factorización aplicada a ecuaciones cuadráticas'] },
      3: { title: 'Potenciación, Radicación y Números Complejos', sub: ['Leyes de exponentes racionales', 'Simplificación de radicales', 'Introducción a números imaginarios'] },
      4: { title: 'Geometría Espacial y Estadística Descriptiva', sub: ['Volumen y área de cilindros, conos y esferas', 'Medidas de tendencia central para datos agrupados', 'Probabilidad de eventos compuestos'] }
    },
    10: {
      1: { title: 'Trigonometría Básica y Ángulos', sub: ['Ángulos en posición normal y conversión grado-radián', 'Razones trigonométricas en triángulos rectángulos', 'Círculo unitario y funciones sen, cos, tan'] },
      2: { title: 'Identidades y Ecuaciones Trigonométricas', sub: ['Identidades pitagóricas y fundamentales', 'Simplificación de expresiones trigonométricas', 'Resolución de ecuaciones trigonométricas'] },
      3: { title: 'Teorema del Seno y del Coso', sub: ['Resolución de triángulos oblicuángulos', 'Ley del Seno y aplicaciones de altura', 'Ley del Coseno y problemas navales/topográficos'] },
      4: { title: 'Geometría Analítica: La Recta y la Circunferencia', sub: ['Ecuación general y canónica de la recta', 'Distancia entre dos puntos y punto medio', 'Ecuación de la circunferencia y parábola'] }
    },
    11: {
      1: { title: 'Funciones Reales y Sus Propiedades', sub: ['Dominio, rango y simetría de funciones', 'Funciones compuestas e inversas', 'Funciones exponenciales y logarítmicas'] },
      2: { title: 'Límites de Funciones y Continuidad', sub: ['Concepto intuitivo y formal de límite', 'Límites indeterminados 0/0 e infinitos', 'Continuidad de funciones en un punto'] },
      3: { title: 'Cálculo Diferencial y La Derivada', sub: ['Regla de la cadena y derivadas básicas', 'Derivada de productos y cocientes', 'Aplicaciones de la derivada: Máximos y mínimos'] },
      4: { title: 'Integración e Introducción al Cálculo Integral', sub: ['Antiderivadas e integrales indefinidas', 'Integral definida y cálculo de áreas bajo la curva', 'Prep Pruebas Saber 11: Razonamiento Cuantitativo'] }
    }
  },
  espanol_lit: {
    6: {
      1: { title: 'Narrativa Tradicional: Mitos y Leyendas', sub: ['Estructura del mito y la leyenda', 'El héroe fantástico en los relatos oral', 'Signos de puntuación y uso de mayúsculas'] },
      2: { title: 'Cuentos Fantásticos y de Aventuras', sub: ['Inicio, nudo y desenlace en la narrativa', 'Descripciones de personajes y ambientes', 'Acentuación ortográfica: agudas, graves y esdrújulas'] },
      3: { title: 'Poesía Infantil y Lírica Popular', sub: ['Verso, estrofa y rima consonante/asonante', 'Figuras literarias simples: metáfora y símil', 'El sustantivo, adjetivo y determinante'] },
      4: { title: 'Teatro Escolar y Representación', sub: ['El texto dramático: diálogos y acotaciones', 'Expresión corporal y voz en el escenario', 'Redacción de cartas e historias cortas'] }
    },
    7: {
      1: { title: 'El Texto Expositivo e Informativo', sub: ['Estructura del artículo de divulgación', 'Identificación de idea principal y secundaria', 'Conectores de orden y causa'] },
      2: { title: 'Categorías Gramaticales y Sintaxis', sub: ['El verbo, modos y tiempos verbales', 'El adverbio y las preposiciones', 'La oración simple: sujeto y predicado'] },
      3: { title: 'Literatura Épica y Relatos de Caballería', sub: ['La gesta medieval y cantares de mi Cid', 'El caballero andante y sus valores', 'El uso de la b/v, c/s/z y g/j'] },
      4: { title: 'Medios de Comunicación e Infografía', sub: ['Análisis de noticias periodísticas', 'Lectura e interpretación de infografías', 'Elaboración de afiches publicitarios'] }
    },
    8: {
      1: { title: 'Literatura Precolombina y de la Conquista', sub: ['Mitos indígenas colombianos y Popol Vuh', 'Diarios de navegación y crónicas de Indias', 'Barroco colonial en América'] },
      2: { title: 'El Ensayo Argumentativo Corto', sub: ['Estructura de tesis, argumentos y conclusión', 'Tipos de argumentos: autoridad y ejemplo', 'Uso adecuado de conectores lógicos'] },
      3: { title: 'El Romanticismo y Realismo en Colombia', sub: ['La lírica romántica: María de Jorge Isaacs', 'El costumbrismo y relatos regionales', 'Oraciones compuestas coordinadas y subordinadas'] },
      4: { title: 'Comunicación Oral: El Debate y la Mesa Redonda', sub: ['Técnicas de argumentación oral', 'Escucha activa y tolerancia de ideas', 'Textos informativos digitales'] }
    },
    9: {
      1: { title: 'El Modernismo y la Generación del 98', sub: ['La poesía de Rubén Darío y José Asunción Silva', 'Estetismo, metáforas y musicalidad', 'Análisis métrico y estilístico'] },
      2: { title: 'Vanguardias Literarias y Boom Latinoamericano', sub: ['El Realismo Mágico y Gabriel García Márquez', 'Rayuela y la novela experimental de Cortázar', 'Comprensión inferencial de novelas complejas'] },
      3: { title: 'Semántica y Lingüística Avanzada', sub: ['Polisemia, sinonimia y antonimia conceptual', 'Cambio lingüístico y neologismos', 'El voseo y variedades dialectales de Colombia'] },
      4: { title: 'Lectura Crítica de Medios y Prensa', sub: ['Detección de sesgos e ideología periodística', 'La columna de opinión y el editorial', 'Diseño y presentación de proyectos de investigación'] }
    },
    10: {
      1: { title: 'Literatura Española: Del Cantar de Mio Cid al Siglo de Oro', sub: ['El Lazarillo de Tormes y la novela picaresca', 'Don Quijote de la Mancha de Cervantes', 'Teatro de Lope de Vega y Calderón de la Barca'] },
      2: { title: 'La Poesía del Siglo de Oro: Góngora y Quevedo', sub: ['Culteranismo vs Conceptismo', 'El soneto clásico petrarquista', 'Análisis sintáctico complejo de oraciones'] },
      3: { title: 'El Ensayo Crítico y Filosófico', sub: ['El ensayo de pensadores hispanoamericanos', 'Coherencia global y cohesión textual', 'Citación y normas APA en trabajos escritos'] },
      4: { title: 'Análisis Crítico del Discurso', sub: ['Microestructura, macroestructura y superestructura', 'El discurso político y publicitario', 'Prep Saber 11: Comprensión Lectora'] }
    },
    11: {
      1: { title: 'Literatura Universal: Tragedia Griega y Shakespeare', sub: ['Sófocles y Edipo Rey: El destino trágico', 'Hamlet y Macbeth: Ambición y duda existencial', 'La catarsis en el teatro clásico'] },
      2: { title: 'Novela Existencialista y Distopías del Siglo XX', sub: ['Kafka, Camus y el sentido de lo absurdo', '1984 y Un Mundo Feliz: Control y vigilancia', 'El cuento contemporáneo latinoamericano'] },
      3: { title: 'Semiótica, Imagen y Textos Discontinuos', sub: ['Análisis semiótico de caricaturas y cómics', 'La imagen publicitaria y la propaganda', 'Lectura de tablas, gráficos y mapas'] },
      4: { title: 'Síntesis Literaria y Preparación Saber 11', sub: ['Pruebas simulacro de lectura crítica', 'Redacción de ensayo académico final', 'Portafolio de producción literaria personal'] }
    }
  },
  naturales: {
    6: {
      1: { title: 'La Célula: Unidad Fundamental de la Vida', sub: ['Teoría celular y tipos celular (procariota/eucariota)', 'Organelos celulares y sus funciones', 'Transporte a través de la membrana celular'] },
      2: { title: 'Niveles de Organización Celular y Tejidos', sub: ['De célula a organismo complejo', 'Tejidos vegetales (meristemos, vascular)', 'Tejidos animales (epitelial, muscular, nervioso)'] },
      3: { title: 'Clasificación de los Seres Vivos (Taxonomía)', sub: ['Los 5 reinos de la naturaleza', 'Bacterias, hongos, plantas y animales', 'Claves dicotómicas de identificación'] },
      4: { title: 'Propiedades de la Materia y Estados', sub: ['Materia, masa, volumen y densidad', 'Estados físico de la materia (sólido, líquido, gas)', 'Cambios de estado térmicos'] }
    },
    7: {
      1: { title: 'Nutrición y Digestión en los Seres Vivos', sub: ['Nutrición autótrofa (Fotosíntesis) y heterótrofa', 'Sistema digestivo humano y enzimas', 'Enfermedades nutricionales y dieta balanceada'] },
      2: { title: 'Respiración y Circulación en Organismos', sub: ['Respiración aeróbica y anaeróbica', 'Sistema respiratorio y gaseoso humano', 'Sistema circulatorio: corazón y vasos sanguíneos'] },
      3: { title: 'Excreción y Reproducción Humana', sub: ['Sistema renal y eliminación de desechos', 'Sistema reproductor masculino y femenino', 'Ciclo menstrual y desarrollo embrionario'] },
      4: { title: 'Tabla Periódica y Elementos Químicos', sub: ['Símbolos químicos y masa atómica', 'Metales, no metales y gases nobles', 'Mezclas homogéneas y heterogéneas'] }
    },
    8: {
      1: { title: 'Sistema Nervioso y Endocrino', sub: ['La neurona y la sinapsis química', 'Sistema nervioso central y periférico', 'Hormonas y glándulas endocrinas'] },
      2: { title: 'Genética Mendelian y ADN', sub: ['Estructura del ADN y ARN', 'Leyes de Mendel de la herencia', 'Cuadros de Punnett y fenotipos'] },
      3: { title: 'Ecosistemas, Cadenas y Redes Tróficas', sub: ['Productores, consumidores y descomponedores', 'Flujo de energía y pirámides tróficas', 'Ciclos del carbono, nitrógeno y agua'] },
      4: { title: 'Reacciones Químicas y Ley de Conservación', sub: ['Reactivos y productos químicos', 'Ecuaciones químicas sencillas', 'Cambios físicos vs cambios químicos'] }
    },
    9: {
      1: { title: 'Evolución y Selección Natural', sub: ['Teorías evolutivas de Lamarck y Darwin', 'Pruebas de la evolución (fósiles, anatomía)', 'Especiación y adaptación al medio'] },
      2: { title: 'Taxonomía Molecular y Genética de Poblaciones', sub: ['Deriva genética y efecto fundador', 'Ingeniería genética y ADN recombinante', 'Biotecnología y transgénicos'] },
      3: { title: 'Taxonomía Ecológica y Biomas Terrestres', sub: ['Biomas del mundo y ecosistemas de Colombia', 'Biodiversidad colombiana y especies endémicas', 'Impacto ambiental y cambio climático'] },
      4: { title: 'Soluciones y Concentración Química', sub: ['Soluto, solvente y solubilidad', 'Concentración porcentaje m/m y v/v', 'Ácidos, bases y escala de pH'] }
    }
  },
  sociales: {
    6: {
      1: { title: 'El Universo, la Tierra y la Cartografía', sub: ['El sistema solar y el planeta Tierra', 'Líneas imaginarias: paralelos y meridianos', 'Uso de mapas, escalas y coordenadas'] },
      2: { title: 'Prehistoria y Primeros Homininos', sub: ['Origen y evolución del ser humano', 'El Paleolítico y el fuego', 'La revolución neolítica y la agricultura'] },
      3: { title: 'Civilizaciones Fluviales Antiguas', sub: ['Mesopotamia entre los ríos Tigris y Éufrates', 'Egipto y el río Nilo', 'India y China antíguas'] },
      4: { title: 'Grecia y Roma Clásicas', sub: ['La polis griega y la democracia ateniense', 'El Imperio Romano y el derecho', 'Mitología y cultura grecorromana'] }
    },
    7: {
      1: { title: 'La Edad Media en Europa y el Feudalismo', sub: ['Caída de Roma e invasiones bárbaras', 'El sistema feudal y los estamentos', 'El papel de la Iglesia en el Medioevo'] },
      2: { title: 'El Mundo Islámico y las Cruzadas', sub: ['Mahoma y la expansión del Islam', 'Las guerras de Cruzadas', 'Intercambio cultural entre Oriente y Occidente'] },
      3: { title: 'Grandes Culturas Precolombinas de América', sub: ['Los Mayas: Astronomía y arquitectura', 'Los Aztecas: Imperio y sociedad', 'Los Incas: Administración y caminos'] },
      4: { title: 'Geografía de Colombia y Climas', sub: ['Regiones naturales de Colombia', 'Pisos térmicos y vertientes hidrográficas', 'Población y diversidad étnica'] }
    },
    8: {
      1: { title: 'Renacimiento, Ilustración y Revolución Científica', sub: ['Humanismo renacentista', 'La Ilustración y los pensadores franceses', 'La Revolución Industrial en Inglaterra'] },
      2: { title: 'Las Revoluciones Políticas del Siglo XVIII', sub: ['Independencia de los Estados Unidos (1776)', 'La Revolución Francesa (1789)', 'Declaración de los Derechos del Hombre'] },
      3: { title: 'Proceso de Independencia de Colombia', sub: ['Causas internas y externas de la independencia', 'El 20 de julio de 1810 y la Patria Boba', 'La campaña libertadora de Simón Bolívar'] },
      4: { title: 'Colombia en el Siglo XIX', sub: ['La Gran Colombia y su disolución', 'Partidos tradicionales: Liberal y Conservador', 'Constituciones del siglo XIX y Guerras Civiles'] }
    },
    9: {
      1: { title: 'Imperialismo y Primera Guerra Mundial', sub: ['El reparto colonial de África y Asia', 'Causas y alianzas de la WWI (1914-1918)', 'El Tratado de Versalles y consecuencias'] },
      2: { title: 'Segunda Guerra Mundial y el Holocausto', sub: ['Fascismo y Nazismo en Europa', 'El desarrollo de la WWII (1939-1945)', 'Consecuencias geopolíticas y fundación de la ONU'] },
      3: { title: 'La Guerra Fría y la Revolución Cubana', sub: ['Bipolaridad: EE.UU. vs la URSS', 'La Revolución Cubana y crisis de los misiles', 'Dictaduras militares en América Latina'] },
      4: { title: 'Colombia en el Siglo XX: La Violencia', sub: ['La Hegemonía Conservadora y República Liberal', 'El Bogotazo (1948) y la violencia bipartidista', 'El Frente Nacional y origen de las guerrillas'] }
    },
    10: {
      1: { title: 'Geopolítica Global y Multipolaridad', sub: ['La caída del Muro de Berlín y fin de la URSS', 'El nuevo orden mundial multipolar', 'Conflictos geopolíticos en Oriente Medio'] },
      2: { title: 'Economía y Globalización', sub: ['Modelos económicos: Capitalismo y Socialismo', 'Neoliberalismo y Tratados de Libre Comercio', 'Organizaciones económicas mundiales (FMI, BM)'] },
      3: { title: 'Estado Social de Derecho y Constitución de 1991', sub: ['La Asamblea Nacional Constituyente', 'Mecanismos de protección: Tutela y Acción Popular', 'Ramas del Poder Público en Colombia'] },
      4: { title: 'Derechos Humanos y Ciudadanía Global', sub: ['Generaciones de los Derechos Humanos', 'Derecho Internacional Humanitario (DIH)', 'Participación ciudadana y democracia activa'] }
    },
    11: {
      1: { title: 'El Conflicto Armado Colombiano', sub: ['Origen y desarrollo de los grupos armados', 'El impacto en la población civil y víctimas', 'El narcotráfico y su influencia política'] },
      2: { title: 'Procesos de Paz y Justicia Transicional', sub: ['Acuerdos de Paz históricos en Colombia', 'El Acuerdo de La Habana (2016) y la JEP', 'Verdad, reparación y no repetición'] },
      3: { title: 'Desarrollo Sostenible y Problemas Ambientales', sub: ['Calentamiento global y cambio climático', 'Deforestación y minería ilegal en Colombia', 'Transición energética y agenda 2030'] },
      4: { title: 'Prep Pruebas Saber 11: Competencias Ciudadanas', sub: ['Análisis de dilemas morales y políticos', 'Evaluación de argumentos y multiperspectivismo', 'Simulacros y técnicas de respuesta Saber 11'] }
    }
  },
  fisica: {
    10: {
      1: { title: 'Magnitudes Físicas y Cinemática 1D', sub: ['Sistema Internacional de Unidades (SI) y conversión', 'Movimiento Rectilíneo Uniforme (MRU)', 'Movimiento Rectilíneo Uniformemente Variado (MRUV)'] },
      2: { title: 'Caída Libre y Movimiento en 2D', sub: ['Aceleración de la gravedad y caída libre', 'Lanzamiento vertical hacia arriba', 'Movimiento parabólico de proyectiles'] },
      3: { title: 'Leyes de Newton y Dinámica', sub: ['Primera Ley: Inercia y masa', 'Segunda Ley: F = m·a', 'Tercera Ley: Acción y reacción, diagramas de cuerpo libre'] },
      4: { title: 'Trabajo, Potencia y Energía Mecánica', sub: ['Concepto físico de Trabajo (W = F·d·cosθ)', 'Energía Cinética y Energía Potencial Gravitacional', 'Ley de conservación de la energía mecánica'] }
    },
    11: {
      1: { title: 'Mecánica de Fluidos: Hidrostática e Hidrodinámica', sub: ['Densidad, presión y Principio de Pascal', 'Principio de Arquímedes y empuje hidrostático', 'Ecuación de continuidad y Bernouilli'] },
      2: { title: 'Termodinámica y Calorimetría', sub: ['Temperatura, calor y escalas térmicas', 'Leyes de la termodinámica', 'Dilatación térmica y transferencia de calor'] },
      3: { title: 'Ondas, Sonido y Óptica', sub: ['Propiedades de las ondas (frecuencia, longitud, amplitud)', 'El sonido, efecto Doppler y resonancia', 'Óptica: Reflexión, refracción, espejos y lentes'] },
      4: { title: 'Electromagnetismo y Física Moderna', sub: ['Ley de Coulomb y campo eléctrico', 'Circuitos eléctricos simples (Ley de Ohm)', 'Prep Saber 11: Física y Ciencias Naturales'] }
    }
  },
  quimica: {
    10: {
      1: { title: 'Estructura Atómica y Modelos', sub: ['Historia de los modelos atómicos (Dalton a Schödinger)', 'Partículas subatómicas (protones, neutrones, electrones)', 'Configuración electrónica y números cuánticos'] },
      2: { title: 'Tabla Periódica y Propiedades Periódicas', sub: ['Organización por grupos y periodos', 'Electronegatividad, radio atómico y energía de ionización', 'Enlaces químicos: Iónico, covalente y metálico'] },
      3: { title: 'Nomenclatura Inorgánica', sub: ['Estados de oxidación de los elementos', 'Óxidos e hidróxidos', 'Ácidos y sales inorgánicas'] },
      4: { title: 'Reacciones Químicas y Balanceo', sub: ['Tipos de reacciones (síntesis, descomposición, sustitución)', 'Balanceo de ecuaciones por tanteo y redox', 'Ley de conservación de la masa de Lavoisier'] }
    },
    11: {
      1: { title: 'Estequiometría y Gases Ideales', sub: ['El concepto de Mol y número de Avogadro', 'Cálculos estequiométricos de masa a masa', 'Leyes de los gases (Boyle, Charles, Gay-Lussac)'] },
      2: { title: 'Soluciones Químicas y pH', sub: ['Molaridad, molalidad y normalidad', 'Teorías de ácidos y bases (Arrhenius, Brønsted-Lowry)', 'Cálculo de pH y soluciones amortiguadoras'] },
      3: { title: 'Introducción a la Química Orgánica', sub: ['El átomo de carbono y la hibridación (sp3, sp2, sp)', 'Hidrocarburos: Alcanos, alquenos y alquinos', 'Nomenclatura IUPAC de cadenas orgánicas'] },
      4: { title: 'Grupos Funcionales Orgánicos y Biomoléculas', sub: ['Alcoholes, aldehídos, cetonas, ácidos carboxílicos', 'Carbohidratos, lípidos, proteínas y ácidos nucleicos', 'Prep Saber 11: Química'] }
    }
  },
  filosofia: {
    10: {
      1: { title: 'Origen de la Filosofía: Presocráticos y Sócrates', sub: ['Del Mito al Logos en la Grecia antigua', 'El Arché de los presocráticos (Agua, Aire, Fuego)', 'El método mayéutico de Sócrates'] },
      2: { title: 'Platón y Aristóteles: Las Grandes Síntesis', sub: ['Teoría de las Ideas y mito de la caverna de Platón', 'Hilemorfismo y teoría de las 4 causas de Aristóteles', 'Ética a Nicómaco y la virtud'] },
      3: { title: 'Filosofía Medieval: Agustín y Tomás de Aquino', sub: ['La Fe y la Razón en la Patrística', 'San Agustín: La Ciudad de Dios y el libre albedrío', 'Santo Tomás de Aquino y las 5 vías de Dios'] },
      4: { title: 'Gnoseología y Teoría del Conocimiento', sub: ['El Racionalismo de Descartes y el Cógito', 'El Empirismo de Locke y Hume', 'La síntesis kantiana: Juicios sintéticos a priori'] }
    },
    11: {
      1: { title: 'Filosofía Política y Contrato Social', sub: ['Thomas Hobbes y el Leviatán', 'John Locke y el liberalismo político', 'Rousseau y la voluntad general'] },
      2: { title: 'Idealismo, Materialismo y Existencialismo', sub: ['La dialéctica de Hegel y la historia', 'El materialismo histórico de Karl Marx', 'Nietzsche, la muerte de Dios y el superhombre'] },
      3: { title: 'Existencialismo y Filosofía del Siglo XX', sub: ['Sartre: La existencia precede a la esencia', 'Heidegger y la pregunta por el Ser', 'La Escuela de Fráncfort y la teoría crítica'] },
      4: { title: 'Bioética y Filosofía de la IA', sub: ['Implicaciones éticas de la inteligencia artificial', 'Dilemas bioéticos contemporáneos', 'Prep Saber 11: Filosofía y Lectura Crítica'] }
    }
  },
  ingles: {
    6: {
      1: { title: 'Personal Information and Verb To Be', sub: ['Greetings, numbers and alphabet', 'Verb To Be: Affirmative, negative and interrogative', 'Introducing yourself and basic descriptions'] },
      2: { title: 'Family Members and Everyday Objects', sub: ['Possessive adjectives (my, your, his, her)', 'Classroom objects and demonstratives (this, that, these, those)', 'Describing family relationships'] },
      3: { title: 'Free Time Activities and Sports', sub: ['Hobbies and sports vocabulary', 'Simple Present: Likes and dislikes', 'Prepositions of place: in, on, under'] },
      4: { title: 'Daily Routines and Time', sub: ['Telling the time', 'Simple Present for daily habits', 'Adverbs of frequency: always, usually, sometimes, never'] }
    },
    7: {
      1: { title: 'Town and Places Vocabulary', sub: ['Giving directions and preposition of movement', 'There is / There are with city places', 'Countable and uncountable nouns'] },
      2: { title: 'Healthy Habits and Food', sub: ['Food vocabulary and shopping', 'How much / How many', 'Modal verb: Should for advice'] },
      3: { title: 'Past Simple: Regular and Irregular Verbs', sub: ['Past Simple tense structures', 'Time expressions: yesterday, last week, ago', 'Writing a short travel diary'] },
      4: { title: 'Comparative and Superlative Adjectives', sub: ['Comparing two or more things/places', 'Adjectives spelling rules', 'Describing famous cities and landscapes'] }
    },
    8: {
      1: { title: 'Present Continuous and Actions', sub: ['Actions happening now', 'Present Continuous vs Present Simple', 'Action verbs and gerunds'] },
      2: { title: 'Future Plans: Going To and Will', sub: ['Predictions with Will', 'Scheduled plans with Be Going To', 'Making promises and spontaneous decisions'] },
      3: { title: 'Modal Verbs of Obligation and Ability', sub: ['Can, Could, May, Must, Have To', 'Rules at school and public places', 'Giving permissions and warnings'] },
      4: { title: 'Weather and Natural Disasters', sub: ['Weather conditions and seasons', 'Past Continuous tense', 'Describing what was happening during an event'] }
    },
    9: {
      1: { title: 'Present Perfect Tense', sub: ['Ever, never, already, yet', 'Since and For with present perfect', 'Life experiences and achievements'] },
      2: { title: 'Conditionals Type 0 and 1', sub: ['Scientific facts and general truths (Type 0)', 'Real possibilities and future consequences (Type 1)', 'Superstitions and future plans'] },
      3: { title: 'Passive Voice in Present and Past', sub: ['Focusing on the action and object', 'Active vs Passive structures', 'Describing processes and inventions'] },
      4: { title: 'Hobbies, Careers and Skills', sub: ['Job profiles and interview vocabulary', 'Gerunds and infinitives after verbs', 'Writing a formal email / CV'] }
    },
    10: {
      1: { title: 'Past Perfect Tense and Narrative', sub: ['Connecting past events chronologically', 'Past Perfect vs Past Simple', 'Writing short story reviews'] },
      2: { title: 'Conditionals Type 2 and Hypotheses', sub: ['Imaginary situations in the present', 'Second Conditional structures (If I were you...)', 'Expressing regrets'] },
      3: { title: 'Reported Speech and Indirect Statements', sub: ['Reporting what someone said', 'Changes in tenses, pronouns and time', 'Writing news reports'] },
      4: { title: 'Phrasal Verbs and Collocations', sub: ['Separable and inseparable phrasal verbs', 'Collocations with make, do, take, get', 'Pre-intermediate IELTS mock readings'] }
    },
    11: {
      1: { title: 'Conditionals Type 3 and Regrets', sub: ['Imaginary past situations', 'Third Conditional structures', 'Expressing regrets about past decisions'] },
      2: { title: 'Advanced Relative Clauses', sub: ['Defining and non-defining relative clauses', 'Relative pronouns: who, which, that, whose, where', 'Synthesizing complex paragraphs'] },
      3: { title: 'Linking Words and Essay Writing', sub: ['Expressing contrast, addition and cause', 'Writing structured opinion essays', 'Debating global issues in English'] },
      4: { title: 'Prep Saber 11 English Module', sub: ['Reading comprehension tips (Parts 1 to 7)', 'Grammar reviews and mock exams', 'Vocabulary drills for high scores'] }
    }
  },
  lectura_critica: {
    6: {
      1: { title: 'Comprensión Literal del Texto', sub: ['Identificar ideas explícitas y personajes', 'Subrayado y toma de notas básicas', 'Organizadores gráficos: mapas conceptuales'] },
      2: { title: 'El Texto Narrativo y Secuencia', sub: ['Inicio, nudo, desenlace y clímax', 'Tipos de narradores y espacio', 'Cuentos y fábulas tradicionales'] },
      3: { title: 'Tipos de Textos Informativos', sub: ['Estructura de la noticia y el reportaje', 'El artículo informativo escolar', 'Identificar el propósito del autor'] },
      4: { title: 'Inferencia y Lectura Comprensiva', sub: ['Deducir el significado de palabras por contexto', 'Hacer hipótesis sobre el final del relato', 'Lectura de imágenes y caricaturas sencillas'] }
    },
    7: {
      1: { title: 'Textos Descontinuos y Cómics', sub: ['Análisis del cómic y la tira cómica', 'Relación entre imagen y texto escrito', 'Comprensión de avisos publicitarios'] },
      2: { title: 'Comprensión Inferencial Intermedia', sub: ['Leer entre líneas y detectar intenciones', 'Distinguir entre hechos y opiniones en un texto', 'Uso de conectores lógicos de causa y efecto'] },
      3: { title: 'Textos Argumentativos Básicos', sub: ['Identificar la tesis u opinión del autor', 'Argumentos sencillos de causa y consecuencia', 'Cartas al director y peticiones escolares'] },
      4: { title: 'Comparación de Dos Textos', sub: ['Identificar similitudes y diferencias de opinión', 'Sintetizar información de dos fuentes', 'Elaboración de resúmenes escritos'] }
    },
    8: {
      1: { title: 'Estructura de Ensayos y Columnas', sub: ['Análisis de la columna de opinión', 'Estructura formal del ensayo argumentativo', 'Identificar el tema y los contraargumentos'] },
      2: { title: 'Identificación de Argumentos de Autoridad', sub: ['Diferenciar argumentos de citas textuales', 'Uso de fuentes y estadísticas de soporte', 'El párrafo de transición y de conclusión'] },
      3: { title: 'Textos Informativos Complejos', sub: ['Análisis de artículos de divulgación científica', 'Identificación de tecnicismos y conceptos clave', 'Lectura crítica de manuales y reglamentos'] },
      4: { title: 'Analogías y Relación de Conceptos', sub: ['Resolver analogías textuales y verbales', 'Relaciones de causa-efecto complejas', 'Organizadores lógicos avanzados'] }
    },
    9: {
      1: { title: 'Detección de Sesgos e Ideologías', sub: ['Identificar el punto de vista ideológico del autor', 'Detección de manipulación mediática y lenguaje emotivo', 'Análisis de editoriales periodísticas'] },
      2: { title: 'Falacias Argumentativas Comunes', sub: ['Falacia Ad Hominem y Ad Populum', 'Generalización apresurada y falsa analogía', 'Detección de falacias en debates y discursos'] },
      3: { title: 'Textos Filosóficos Elementales', sub: ['Comprensión de aforismos y diálogos socráticos', 'Identificación de la premisa principal y conclusión', 'Sustentación escrita de tesis personales'] },
      4: { title: 'Lectura de Textos Multimodales', sub: ['Análisis de infografías científicas complejas', 'Lectura de tablas de datos, gráficos y diagramas', 'Relación de imágenes satíricas y geopolítica'] }
    },
    10: {
      1: { title: 'Textos Filosóficos y Políticos Complejos', sub: ['Análisis de discursos de filósofos modernos', 'Premisas lógicas, silogismos y validez', 'Identificación de intencionalidades implícitas'] },
      2: { title: 'Evaluación de Argumentos y Multiperspectivismo', sub: ['Análisis de un problema desde múltiples puntos de vista', 'Fortalezas y debilidades de una postura escrita', 'El ensayo argumentativo formal académico'] },
      3: { title: 'Lectura Crítica Saber 11: Textos Continuos', sub: ['Estrategias para textos continuos: novela, cuento, ensayo', 'Detección de coherencia y cohesión global', 'Técnicas de descarte de opciones múltiples'] },
      4: { title: 'Lectura Crítica Saber 11: Textos Discontinuos', sub: ['Estrategias para infografías, tablas, publicidad', 'Relación imagen-cifra-texto', 'Simulacros cronometrados Saber 11'] }
    },
    11: {
      1: { title: 'Análisis Crítico del Discurso Geopolítico', sub: ['Análisis semiótico del discurso presidencial y prensa', 'Intertextualidad y contexto socio-histórico', 'El ensayo de opinión crítico estructurado'] },
      2: { title: 'Filosofía Contemporánea y Textos Académicos', sub: ['Comprensión de textos de autores del siglo XX', 'Identificación de tesis densas y abstractas', 'Redacción de contratesis argumentadas'] },
      3: { title: 'Entrenamiento Intensivo Pruebas Saber 11', sub: ['Resolución de preguntas de alta complejidad Saber 11', 'Taller de análisis de opciones trampa', 'Simulacros completos de la prueba real'] },
      4: { title: 'Sustentación de Ensayo de Grado', sub: ['Redacción del ensayo argumentativo final de grado', 'Técnicas de expresión oral y debate crítico', 'Portafolio final de lectura comprensiva'] }
    }
  }
};

// ==========================================
// FUNCIÓN: Obtiene tema y subtemas para una materia/grado/periodo
// ==========================================
export const getSubjectTopicData = (subjectValue, grade, period) => {
  // Buscar en el mapa especializado por grado
  const match = gradeCurriculum[subjectValue]?.[grade]?.[period];
  if (match) {
    return {
      title: `${match.title} (${grade}° Grado)`,
      sub: match.sub
    };
  }

  // Fallback con generador inteligente diferenciador de edad y grado
  const subLabel = subjectOptions.find(s => s.value === subjectValue)?.label || subjectValue;
  
  const gradeLevelThemes = {
    6: { title: `Fundamentos Básicos e Introducción a ${subLabel}`, sub: [`Introducción a ${subLabel} y glosario inicial`, `Bases conceptuales prácticas`, `Taller práctico exploratorio`] },
    7: { title: `Métodos y Herramientas de ${subLabel}`, sub: [`Métodos sistemáticos sencillos`, `Uso de herramientas de apoyo`, `Ejercicios guiados intermedios`] },
    8: { title: `Estructuras y Conexiones en ${subLabel}`, sub: [`Estructuras y taxonomías del tema`, `Relaciones interdisciplinares`, `Trabajo colaborativo práctico`] },
    9: { title: `Modelos y Análisis Crítico de ${subLabel}`, sub: [`Modelado analítico del tema`, `Estrategias de comprensión crítica`, `Proyectos experimentales`] },
    10: { title: `Aplicaciones Complejas e Investigación en ${subLabel}`, sub: [`Análisis de problemáticas avanzadas`, `Metodología de diseño y ensayo`, `Simulacro y competencias de argumentación`] },
    11: { title: `Proyectos Integrales y Competencias del Siglo XX en ${subLabel}`, sub: [`Análisis crítico de nivel universitario`, `Propuestas de investigación e innovación`, `Preparación Saber 11 / Proyecto final`] }
  };

  const selectedTheme = gradeLevelThemes[grade] || gradeLevelThemes[6];
  
  const periodProgressions = {
    1: { title: `${selectedTheme.title} - Fase Inicial`, sub: [selectedTheme.sub[0], `Conceptos de entrada de la unidad`, `Diagnóstico de competencias iniciales`] },
    2: { title: `${selectedTheme.title} - Fase de Estructuración`, sub: [selectedTheme.sub[1], `Ejes temáticos complementarios`, `Ejercicios prácticos integrados`] },
    3: { title: `${selectedTheme.title} - Fase de Aplicación`, sub: [selectedTheme.sub[2], `Talleres cooperativos aplicados`, `Análisis de casos prácticos`] },
    4: { title: `${selectedTheme.title} - Fase de Consolidación`, sub: [`Evaluación de desempeño y proyectos`, `Sustentación de saberes del periodo`, `Retroalimentación final de periodo`] }
  };

  const currentTopic = periodProgressions[period] || periodProgressions[1];

  return {
    title: `${currentTopic.title} (Grado ${grade}°)`,
    sub: currentTopic.sub
  };
};

// ==========================================
// FUNCIÓN: Genera recursos proceduralmente para una combinación de filtros
// ==========================================

export const getResourceContent = (subjectValue, grade, period, tipo) => {
  const data = getSubjectTopicData(subjectValue, grade, period);
  const subtopics = data.sub;
  const subLabel = subjectOptions.find(s => s.value === subjectValue)?.label || subjectValue;

  if (tipo === 'temas' || tipo === 'clases') {
    return [
      {
        id: `${subjectValue}-${grade}-p${period}-tema1`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'temas',
        tema: data.title,
        subtemas: subtopics,
        titulo: `Tema 1: ${subtopics[0]}`,
        descripcion: `Desarrollo conceptual, conceptos clave y fundamentos pedagógicos para profundizar en ${subtopics[0]} en grado ${grade}°.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-tema2`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'temas',
        tema: data.title,
        subtemas: subtopics,
        titulo: `Tema 2: ${subtopics[1]}`,
        descripcion: `Análisis de contenidos, estrategias procedimentales e ideas clave sobre ${subtopics[1]} orientados al Periodo ${period}.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-tema3`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'temas',
        tema: data.title,
        subtemas: subtopics,
        titulo: `Tema 3: ${subtopics[2]}`,
        descripcion: `Síntesis temática, proyectos contextualizados y profundización conceptual en ${subtopics[2]}.`,
        inclusivo: false
      }
    ];
  }

  if (tipo === 'guias') {
    return [
      {
        id: `${subjectValue}-${grade}-p${period}-guia1`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'guias',
        tema: data.title,
        titulo: `Guía de Aprendizaje: ${subtopics[0]}`,
        descripcion: `Guía conceptual estructurada con lecturas, esquemas explicativos y preguntas orientadoras para grado ${grade}°.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-guia2`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'guias',
        tema: data.title,
        titulo: `Guía de Profundización: ${subtopics[1]}`,
        descripcion: `Material de trabajo autónomo con organizadores gráficos y síntesis conceptual del periodo ${period}.`,
        inclusivo: false
      }
    ];
  }

  if (tipo === 'talleres') {
    return [
      {
        id: `${subjectValue}-${grade}-p${period}-taller1`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'talleres',
        tema: data.title,
        titulo: `Taller Práctico: Ejercicios sobre ${subtopics[0]}`,
        descripcion: `Taller imprimible con 6 ítems graduados por nivel de dificultad diseñados para trabajar en clase.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-taller2`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'talleres',
        tema: data.title,
        titulo: `Taller Evaluativo en Parejas: ${subtopics[1]}`,
        descripcion: `Actividad cooperativa con rúbrica de autoevaluación y coevaluación para grado ${grade}°.`,
        inclusivo: false
      }
    ];
  }

  if (tipo === 'examenes') {
    return [
      {
        id: `${subjectValue}-${grade}-p${period}-exam1`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'examenes',
        tema: `Evaluación Periodo ${period}`,
        titulo: `Examen Parcial Imprimible: ${data.title}`,
        descripcion: `Prueba escrita con 5 preguntas de selección múltiple tipo Saber 11 y 2 preguntas de desarrollo corto. Lista para imprimir o descargar en Word.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-exam2`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'examenes',
        tema: `Evaluación Periodo ${period}`,
        titulo: `Examen Final del Periodo ${period} - ${subLabel}`,
        descripcion: `Evaluación acumulativa sumativa de 10 ítems estructurados según competencias del MEN para grado ${grade}°.`,
        inclusivo: false
      }
    ];
  }

  if (tipo === 'quizzes') {
    return [
      {
        id: `${subjectValue}-${grade}-p${period}-quiz1`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'quizzes',
        tema: data.title,
        titulo: `Quiz Rápido Imprimible: ${subtopics[0]}`,
        descripcion: `Evaluación corta de 5 minutos (5 preguntas cortas). Formato limpio para fotocopiar o descargar en Word.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-quiz2`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'quizzes',
        tema: data.title,
        titulo: `Quiz de Diagnóstico Exprès: ${subtopics[1]}`,
        descripcion: `Comprobación exprés de 4 ítems de opción múltiple con clave de respuestas para el docente.`,
        inclusivo: false
      }
    ];
  }

  if (tipo === 'videos') {
    return [
      {
        id: `${subjectValue}-${grade}-p${period}-video1`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'videos',
        tema: data.title,
        titulo: `Video Tutorial Animado: Explicando ${subtopics[0]}`,
        descripcion: `Recurso audiovisual interactivo de 6 minutos con animaciones conceptuales ideales para grado ${grade}°.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-video2`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'videos',
        tema: data.title,
        titulo: `Demostración Interactiva en Video: ${subtopics[1]}`,
        descripcion: `Video explicativo con guía de observación y preguntas de reflexión para pausar durante la clase.`,
        inclusivo: false
      }
    ];
  }

  if (tipo === 'juegos') {
    return [
      {
        id: `${subjectValue}-${grade}-p${period}-juego1`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'juegos',
        tema: data.title,
        titulo: `Juego de Trivia Interactivo: Desafío de ${subtopics[0]}`,
        descripcion: `Actividad gamificada estilo Kahoot / Wordwall con preguntas rápidas y marcador de puntos en vivo.`,
        inclusivo: false
      },
      {
        id: `${subjectValue}-${grade}-p${period}-juego2`,
        materia: subjectValue, grado: grade, periodo: period, tipo: 'juegos',
        tema: data.title,
        titulo: `Reto por Equipos: El Laberinto de ${subtopics[1]}`,
        descripcion: `Juego interactivo de emparejamiento conceptual y roles para resolver en equipos cooperativos.`,
        inclusivo: false
      }
    ];
  }

  if (tipo === 'tips_docente') {
    return getInclusiveTips(subjectValue, grade, period);
  }

  return [];
};

// ==========================================
// TIPS INCLUSIVOS Y RECURSOS PIAR/DUA
// ==========================================

const getInclusiveTips = (subjectValue, grade, period) => {
  const genericTips = [
    {
      id: `inc-tdah-${grade}-p${period}`,
      materia: 'educacion_inclusiva', materiaOrigen: subjectValue,
      grado: grade, periodo: period, tipo: 'tips_docente',
      tema: 'Estrategias de Aula para Estudiantes con TDAH',
      titulo: 'Tip Pedagógico: Segmentación de Tareas y Enfoque',
      descripcion: 'Aplica la regla de "instrucción en 3 pasos", temporizadores visuales y pausas propioceptivas para mantener la atención.',
      inclusivo: true
    },
    {
      id: `inc-tea-${grade}-p${period}`,
      materia: 'educacion_inclusiva', materiaOrigen: subjectValue,
      grado: grade, periodo: period, tipo: 'tips_docente',
      tema: 'Acompañamiento en el Espectro Autista (TEA)',
      titulo: 'Tip Pedagógico: Anticipación Visual y Rutinas Claras',
      descripcion: 'Uso de agendas visuales al inicio de clase para reducir ansiedad frente a cambios de actividad.',
      inclusivo: true
    },
    {
      id: `inc-dua-${grade}-p${period}`,
      materia: 'educacion_inclusiva', materiaOrigen: subjectValue,
      grado: grade, periodo: period, tipo: 'tips_docente',
      tema: 'Diseño Universal para el Aprendizaje (DUA)',
      titulo: 'Tip DUA: Múltiples Formas de Representación',
      descripcion: 'Presenta la información en al menos 2 formatos distintos (visual, auditivo, kinestésico) para garantizar el acceso al contenido.',
      inclusivo: true
    }
  ];

  const subLabel = subjectOptions.find(s => s.value === subjectValue)?.label || subjectValue;
  const data = getSubjectTopicData(subjectValue, grade, period);

  const specificTip = {
    id: `inc-${subjectValue}-${grade}-p${period}-adapt`,
    materia: 'educacion_inclusiva', materiaOrigen: subjectValue,
    grado: grade, periodo: period, tipo: 'tips_docente',
    tema: `Adaptación Curricular para ${subLabel}`,
    titulo: `Adaptación PIAR: ${data.title}`,
    descripcion: `Material adaptado con lectura fácil, tipografía accesible (14pt), espaciado amplio y pictogramas de apoyo para grado ${grade}°.`,
    inclusivo: true
  };

  return [...genericTips, specificTip];
};

// ==========================================
// FUNCIÓN: Obtiene recursos para la materia "Educación Inclusiva"
// ==========================================

export const getInclusiveResources = (grade, period, tipo) => {
  if (tipo === 'tips_docente') {
    return getInclusiveTips('general', grade, period);
  }

  const allMaterias = Object.keys(gradeCurriculum);
  const results = [];

  allMaterias.forEach(matValue => {
    const data = getSubjectTopicData(matValue, grade, period);
    const subLabel = subjectOptions.find(s => s.value === matValue)?.label || matValue;

    if (tipo === 'talleres') {
      results.push({
        id: `inc-${matValue}-${grade}-p${period}-taller-dua`,
        materia: 'educacion_inclusiva', materiaOrigen: matValue,
        grado: grade, periodo: period, tipo: 'talleres',
        tema: `${data.title} con Pictogramas (DUA)`,
        titulo: `Taller Adaptado DUA: ${subLabel}`,
        descripcion: `Diseñado con lectura fácil, código de color, soporte de bloques visuales y actividades simplificadas paso a paso.`,
        inclusivo: true
      });
    }

    if (tipo === 'examenes' || tipo === 'quizzes') {
      results.push({
        id: `inc-${matValue}-${grade}-p${period}-exam-piar`,
        materia: 'educacion_inclusiva', materiaOrigen: matValue,
        grado: grade, periodo: period, tipo: tipo,
        tema: `Evaluación Adaptada DUA/PIAR`,
        titulo: `Evaluación Diferenciada PIAR: ${subLabel}`,
        descripcion: `Quiz/Examen con tipografía de alta legibilidad, espaciado amplio, pictogramas de apoyo e ítems directos para grado ${grade}°.`,
        inclusivo: true
      });
    }

    if (tipo === 'guias' || tipo === 'clases' || tipo === 'temas') {
      results.push({
        id: `inc-${matValue}-${grade}-p${period}-guia-dua`,
        materia: 'educacion_inclusiva', materiaOrigen: matValue,
        grado: grade, periodo: period, tipo: tipo,
        tema: `Recurso Accesible DUA para ${subLabel}`,
        titulo: `Guía/Clase Inclusiva: ${data.title}`,
        descripcion: `Plan con lenguaje simplificado, instrucciones paso a paso con apoyo visual y múltiples opciones de respuesta.`,
        inclusivo: true
      });
    }
  });

  return results.slice(0, 6);
};

// ==========================================
// FUNCIÓN: Genera exactamente 13 temas sueltos y progresivos por periodo
// ==========================================
export const get13CurriculumTopics = (subjectValue, grade, period) => {
  const data = getSubjectTopicData(subjectValue, grade, period);
  const subtopics = data.sub || [];
  const mainTitle = data.title || "Módulo Temático";

  const topicsList = [];
  
  const weekDetails = [
    { name: "Introducción y Diagnóstico Inicial", goal: "Explicar las bases fundamentales, glosario clave y motivación del tema." },
    { name: "Conceptos Fundamentales", goal: "Profundizar en la conceptualización teórica y el marco de estudio." },
    { name: "Principios y Reglas Clave", goal: "Estudio detallado de las leyes, propiedades o reglas principales del tema." },
    { name: "Modelado y Ejemplos Prácticos", goal: "Explicación guiada en voz alta con ejemplos resueltos paso a paso." },
    { name: "Taller de Afianzamiento Cooperativo", goal: "Trabajo práctico en parejas con ejercicios de nivel básico a intermedio." },
    { name: "Aplicación Contextualizada", goal: "Conectar los conceptos teóricos con problemas y escenarios de la vida real." },
    { name: "Profundización Curricular I", goal: "Desafíos de nivel intermedio para fortalecer el razonamiento crítico." },
    { name: "Uso de Recursos Didácticos Digitales", goal: "Integrar simulaciones, laboratorios o herramientas interactivas." },
    { name: "Taller de Profundización Avanzada", goal: "Ejercicios de alta complejidad para potenciar habilidades." },
    { name: "Análisis Crítico y Debates", goal: "Espacio de discusión grupal, dilemas o argumentación colectiva." },
    { name: "Preparación de Examen Temático", goal: "Repaso integral de los conceptos con simulacros de preguntas." },
    { name: "Examen Sumativo de Unidad", goal: "Evaluación formal de competencias y habilidades adquiridas." },
    { name: "Retroalimentación y Nivelación DUA", goal: "Sesión de consolidación con apoyos específicos según el Diseño Universal." }
  ];

  for (let w = 1; w <= 13; w++) {
    const subtopicIdx = Math.min(Math.floor((w - 1) / 4.3), subtopics.length - 1);
    const subtopic = subtopics[subtopicIdx] || "Desarrollo del Tema";
    const detail = weekDetails[w - 1];

    topicsList.push({
      id: `${subjectValue}-${grade}-p${period}-tema${w}`,
      materia: subjectValue,
      grado: grade,
      periodo: period,
      tipo: 'temas',
      semana: w,
      tema: `Tema ${w}: ${subtopic}`,
      subtemas: subtopics,
      titulo: `Tema ${w}: ${subtopic} - ${detail.name}`,
      descripcion: `${detail.goal} Orientado a ${subtopic} para grado ${grade}°.`,
      inclusivo: false
    });
  }

  return topicsList;
};

// ==========================================
// FUNCIÓN PRINCIPAL DE FILTRADO
// ==========================================
export const getFilteredResources = (materiaValue, grade, period, tipo) => {
  if (materiaValue === 'educacion_inclusiva') {
    return getInclusiveResources(grade, period, tipo);
  }
  return get13CurriculumTopics(materiaValue, grade, period);
};
