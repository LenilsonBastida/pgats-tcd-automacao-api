/**
 * Gera um email aleatório com Faker simples
 * @returns {string} Email aleatório no formato firstname.lastname@test.com
 */
export function generateRandomEmail() {
  const firstNames = [
    'Ana',
    'Bruno',
    'Carlos',
    'Diana',
    'Eduardo',
    'Fernanda',
    'Gabriel',
    'Helena',
    'Igor',
    'Juliana',
  ];
  const lastNames = [
    'Silva',
    'Santos',
    'Oliveira',
    'Costa',
    'Ferreira',
    'Rodrigues',
    'Martins',
    'Pereira',
    'Sousa',
    'Gomes',
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const timestamp = Date.now();

  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@test.com`;
}

/**
 * Gera um nome de usuário aleatório
 * @returns {string} Nome de usuário aleatório
 */
export function generateRandomUsername() {
  const adjectives = ['Happy', 'Lucky', 'Smart', 'Quick', 'Bright', 'Fast', 'Cool', 'Nice'];
  const nouns = ['Tiger', 'Eagle', 'Falcon', 'Dragon', 'Phoenix', 'Wolf', 'Lion', 'Bear'];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);

  return `${adjective}${noun}${number}`;
}

/**
 * Gera uma senha segura aleatória
 * @returns {string} Senha com letras maiúsculas, minúsculas, números e caracteres especiais
 */
export function generateRandomPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];

  const password =
    getRandomChar(uppercase) +
    getRandomChar(lowercase) +
    getRandomChar(numbers) +
    getRandomChar(special) +
    getRandomChar(uppercase) +
    getRandomChar(lowercase) +
    getRandomChar(numbers) +
    getRandomChar(special);

  return password;
}
