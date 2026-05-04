/**
 * Example Tests - Unit Testing Examples
 * Run: npm test (if jest is configured)
 */

import { User } from '../domain/model/User.js';
import { Message } from '../domain/model/Message.js';
import { Conversation } from '../domain/model/Conversation.js';
import { Validator } from '../utils/validators.js';
import { Logger } from '../utils/logger.js';

// ===== VALIDATOR TESTS =====
console.log('\n📋 ===== VALIDATOR TESTS =====');

const testValidator = () => {
  const tests = [
    {
      name: 'Valid Email',
      test: () => Validator.isValidEmail('test@example.com'),
      expected: true
    },
    {
      name: 'Invalid Email',
      test: () => Validator.isValidEmail('invalid-email'),
      expected: false
    },
    {
      name: 'Valid UUID',
      test: () => Validator.isValidUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
      expected: true
    },
    {
      name: 'Valid Phone',
      test: () => Validator.isValidPhone('+84912345678'),
      expected: true
    },
    {
      name: 'Valid URL',
      test: () => Validator.isValidURL('https://example.com'),
      expected: true
    },
    {
      name: 'Valid Message Length',
      test: () => Validator.isValidMessageLength('Hello World'),
      expected: true
    },
    {
      name: 'Message Too Long',
      test: () => Validator.isValidMessageLength('x'.repeat(5001)),
      expected: false
    }
  ];

  tests.forEach(({ name, test, expected }) => {
    const result = test();
    const status = result === expected ? '✅' : '❌';
    console.log(`${status} ${name}: ${result}`);
  });
};

testValidator();

// ===== MODEL TESTS =====
console.log('\n📋 ===== MODEL TESTS =====');

const testModels = () => {
  // Create User
  const user = new User('1', 'John Doe', 'john@example.com');
  console.log(`✅ User created: ${user.id}, ${user.name}`);

  // Create Message
  const message = new Message('msg-1', 'conv-1', 'john@example.com', 'Hello everyone!');
  console.log(`✅ Message created: ${message.id}, "${message.content}"`);

  // Create Conversation
  const conversation = new Conversation('conv-1', 'Chat Group', 'group', ['user1', 'user2', 'user3']);
  console.log(`✅ Conversation created: ${conversation.id}, ${conversation.name}`);
};

testModels();

// ===== LOGGER TESTS =====
console.log('\n📋 ===== LOGGER TESTS =====');

const logger = new Logger('TestModule');
logger.info('This is an info message', { key: 'value' });
logger.success('Operation completed successfully');
logger.warn('This is a warning');
logger.error('Something went wrong');
logger.debug('Debug information');

// ===== SANITIZATION TESTS =====
console.log('\n📋 ===== SANITIZATION TESTS =====');

const sanitizationTests = [
  {
    input: '<script>alert("XSS")</script>Hello',
    expected: 'alertXSSHello'
  },
  {
    input: 'Normal text',
    expected: 'Normal text'
  },
  {
    input: '   Whitespace   ',
    expected: 'Whitespace'
  }
];

sanitizationTests.forEach(({ input, expected }) => {
  const result = Validator.sanitizeString(input);
  const sanitized = Validator.escapeHTML(result);
  console.log(`Input: "${input}"`);
  console.log(`Output: "${sanitized}"`);
  console.log('---');
});

// ===== VALIDATION TESTS =====
console.log('\n📋 ===== VALIDATION TESTS =====');

try {
  const requiredFields = ['name', 'email', 'password'];
  const obj = { name: 'John', email: 'john@example.com' };
  Validator.validateRequiredFields(obj, requiredFields);
  console.log('❌ Should have thrown error');
} catch (error) {
  console.log(`✅ Caught error: ${error.message}`);
}

try {
  const requiredFields = ['name', 'email'];
  const obj = { name: 'John', email: 'john@example.com' };
  Validator.validateRequiredFields(obj, requiredFields);
  console.log('✅ All required fields present');
} catch (error) {
  console.log(`❌ ${error.message}`);
}

// ===== ENUM VALIDATION TEST =====
console.log('\n📋 ===== ENUM VALIDATION TEST =====');

const MESSAGE_TYPES = {
  TEXT: 'text',
  VOICE: 'voice',
  IMAGE: 'image'
};

const isValidType = Validator.isValidEnum('text', MESSAGE_TYPES);
console.log(`✅ Is 'text' valid message type: ${isValidType}`);

const isInvalidType = Validator.isValidEnum('video', MESSAGE_TYPES);
console.log(`✅ Is 'video' valid message type: ${isInvalidType}`);

// ===== ARRAY VALIDATION TEST =====
console.log('\n📋 ===== ARRAY VALIDATION TEST =====');

const users = ['user1', 'user2', 'user3'];
const isValidArray = Validator.isValidArray(users, 1, 10);
console.log(`✅ Is valid user array: ${isValidArray}`);

const emptyArray = [];
const isEmptyValid = Validator.isValidArray(emptyArray, 1, 10);
console.log(`✅ Is empty array valid (min 1): ${isEmptyValid}`);

console.log('\n✨ All example tests completed!\n');
