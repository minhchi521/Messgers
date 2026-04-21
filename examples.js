/**
 * Example Usage - Test the Application
 * Chạy file này để test các chức năng của ứng dụng
 */
import { ServiceContainer } from './config/ServiceContainer.js';
import { CreateUserDTO } from './domain/dto/CreateUserDTO.js';
import { CreateConversationDTO } from './domain/dto/CreateConversationDTO.js';
import { CreateMessageDTO } from './domain/dto/CreateMessageDTO.js';
import { CreateVoiceMessageDTO } from './domain/dto/CreateVoiceMessageDTO.js';

async function runExamples() {
  const container = new ServiceContainer();
  
  try {
    console.log('\n📝 === EXAMPLE TEST CASES ===\n');

    // 1. Tạo người dùng
    console.log('1️⃣  Tạo người dùng...');
    const createUserUseCase = container.getService('createUserUseCase');
    
    const user1 = await createUserUseCase.execute(
      new CreateUserDTO('Alice', 'alice@example.com', 'https://example.com/alice.jpg')
    );
    console.log('✅ User 1 created:', user1.name, user1.id);

    const user2 = await createUserUseCase.execute(
      new CreateUserDTO('Bob', 'bob@example.com')
    );
    console.log('✅ User 2 created:', user2.name, user2.id);

    const user3 = await createUserUseCase.execute(
      new CreateUserDTO('Charlie', 'charlie@example.com')
    );
    console.log('✅ User 3 created:', user3.name, user3.id);

    // 2. Tạo cuộc trò chuyện
    console.log('\n2️⃣  Tạo cuộc trò chuyện...');
    const createConversationUseCase = container.getService('createConversationUseCase');
    
    const conversation1 = await createConversationUseCase.execute(
      new CreateConversationDTO(
        'Alice & Bob',
        'private',
        [user1.id, user2.id]
      )
    );
    console.log('✅ Conversation 1 created:', conversation1.name, conversation1.id);

    const conversation2 = await createConversationUseCase.execute(
      new CreateConversationDTO(
        'Group Chat',
        'group',
        [user1.id, user2.id, user3.id]
      )
    );
    console.log('✅ Conversation 2 created:', conversation2.name, conversation2.id);

    // 3. Gửi tin nhắn văn bản
    console.log('\n3️⃣  Gửi tin nhắn văn bản...');
    const sendMessageUseCase = container.getService('sendMessageUseCase');
    
    const message1 = await sendMessageUseCase.execute(
      new CreateMessageDTO(user1.id, 'Hello Bob!', conversation1.id)
    );
    console.log('✅ Message 1 sent:', message1.content);

    const message2 = await sendMessageUseCase.execute(
      new CreateMessageDTO(user2.id, 'Hi Alice! How are you?', conversation1.id)
    );
    console.log('✅ Message 2 sent:', message2.content);

    const message3 = await sendMessageUseCase.execute(
      new CreateMessageDTO(user1.id, 'I am good, thanks!', conversation1.id)
    );
    console.log('✅ Message 3 sent:', message3.content);

    // 4. Gửi tin nhắn voice
    console.log('\n4️⃣  Gửi tin nhắn voice...');
    const sendVoiceMessageUseCase = container.getService('sendVoiceMessageUseCase');
    
    const voiceMessage1 = await sendVoiceMessageUseCase.execute(
      new CreateVoiceMessageDTO(
        user2.id,
        'https://example.com/audio/message1.mp3',
        8,
        conversation1.id
      )
    );
    console.log('✅ Voice message sent, duration:', voiceMessage1.duration, 'seconds');

    // 5. Lấy tin nhắn từ cuộc trò chuyện
    console.log('\n5️⃣  Lấy tin nhắn từ cuộc trò chuyện...');
    const getConversationMessagesUseCase = container.getService('getConversationMessagesUseCase');
    
    const messages = await getConversationMessagesUseCase.execute(conversation1.id);
    console.log(`✅ Found ${messages.length} messages:`);
    messages.forEach((msg, index) => {
      console.log(`   ${index + 1}. [${msg.type.toUpperCase()}] ${msg.content || '🎤 Voice message'}`);
    });

    // 6. Lấy thông tin người dùng
    console.log('\n6️⃣  Lấy thông tin người dùng...');
    const getUserUseCase = container.getService('getUserUseCase');
    
    const allUsers = await getUserUseCase.executeAll();
    console.log(`✅ Total users: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    // 7. Test error handling
    console.log('\n7️⃣  Test error handling...');
    try {
      await createUserUseCase.execute(
        new CreateUserDTO('Invalid User', 'invalid-email')
      );
    } catch (error) {
      console.log('✅ Caught expected error:', error.message);
    }

    try {
      await sendMessageUseCase.execute(
        new CreateMessageDTO(user1.id, '', conversation1.id)
      );
    } catch (error) {
      console.log('✅ Caught expected error:', error.message);
    }

    console.log('\n✨ === ALL TESTS PASSED ===\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run examples
runExamples();
