import { useEffect, useState } from 'react';

// Available languages
export const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    font: 'Inter, sans-serif'
  },
  km: {
    code: 'km',
    name: 'ភាសាខ្មែរ',
    flag: '🇰🇭',
    dir: 'ltr',
    font: 'Khmer OS Battambang, sans-serif'
  },
  zh: {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    font: 'Noto Sans SC, sans-serif'
  }
};

// Language translation data
export const translations = {
  en: {
    common: {
      welcome: 'Welcome to Discord Chat',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      confirmPassword: 'Confirm Password',
      submit: 'Submit',
      cancel: 'Cancel',
      search: 'Search',
      settings: 'Settings',
      profile: 'Profile',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      join: 'Join'
    },
    auth: {
      loginTitle: 'Login to your account',
      registerTitle: 'Create an account',
      forgotPassword: 'Forgot password?',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      loginSuccess: 'Logged in successfully!',
      registerSuccess: 'Account created successfully!',
      loginError: 'Invalid email or password',
      registerError: 'Registration failed'
    },
    chat: {
      newMessage: 'New Message',
      typeMessage: 'Type a message...',
      online: 'Online',
      offline: 'Offline',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      typing: 'is typing...',
      edited: 'edited',
      pinned: 'Pinned Messages',
      reactions: 'Reactions',
      addReaction: 'Add Reaction',
      reply: 'Reply',
      files: 'Files',
      noMessages: 'No messages yet. Start a conversation!',
      loadMore: 'Load more messages'
    },
    servers: {
      createServer: 'Create a Server',
      joinServer: 'Join a Server',
      inviteCode: 'Invite Code',
      serverName: 'Server Name',
      channels: 'Channels',
      createChannel: 'Create Channel',
      channelName: 'Channel Name',
      channelType: 'Channel Type',
      textChannel: 'Text Channel',
      voiceChannel: 'Voice Channel',
      members: 'Members',
      roles: 'Roles',
      createRole: 'Create Role',
      roleName: 'Role Name',
      permissions: 'Permissions'
    },
    directMessages: {
      title: 'Direct Messages',
      new: 'New DM',
      noConversations: 'No conversations yet',
      startConversation: 'Start a conversation with someone!'
    }
  },
  km: {
    common: {
      welcome: 'សូមស្វាគមន៍មកកាន់ Discord Chat',
      login: 'ចូល',
      register: 'ចុះឈ្មោះ',
      logout: 'ចាកចេញ',
      email: 'អ៊ីមែល',
      password: 'ពាក្យសម្ងាត់',
      username: 'ឈ្មោះអ្នកប្រើ',
      confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
      submit: 'ដាក់ស្នើ',
      cancel: 'បោះបង់',
      search: 'ស្វែងរក',
      settings: 'ការកំណត់',
      profile: 'ប្រវត្តិរូប',
      save: 'រក្សាទុក',
      edit: 'កែប្រែ',
      delete: 'លុប',
      create: 'បង្កើត',
      join: 'ចូលរួម'
    },
    auth: {
      loginTitle: 'ចូលទៅគណនីរបស់អ្នក',
      registerTitle: 'បង្កើតគណនីមួយ',
      forgotPassword: 'ភ្លេចពាក្យសម្ងាត់?',
      noAccount: 'មិនមានគណនីទេឬ?',
      hasAccount: 'មានគណនីរួចហើយឬ?',
      loginSuccess: 'បានចូលដោយជោគជ័យ!',
      registerSuccess: 'បានបង្កើតគណនីដោយជោគជ័យ!',
      loginError: 'អ៊ីមែលឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
      registerError: 'ការចុះឈ្មោះបានបរាជ័យ'
    },
    chat: {
      newMessage: 'សារថ្មី',
      typeMessage: 'វាយសារ...',
      online: 'កំពុងប្រើ',
      offline: 'ក្រៅបណ្ដាញ',
      idle: 'ទំនេរ',
      dnd: 'កុំរំខាន',
      typing: 'កំពុងវាយអក្សរ...',
      edited: 'បានកែប្រែ',
      pinned: 'សារដែលបានខ្ទាស់',
      reactions: 'ប្រតិកម្ម',
      addReaction: 'បន្ថែមប្រតិកម្ម',
      reply: 'ឆ្លើយតប',
      files: 'ឯកសារ',
      noMessages: 'មិនទាន់មានសារនៅឡើយទេ។ ចាប់ផ្តើមសន្ទនា!',
      loadMore: 'ផ្ទុកសារបន្ថែម'
    },
    servers: {
      createServer: 'បង្កើតម៉ាស៊ីនបម្រើ',
      joinServer: 'ចូលរួមម៉ាស៊ីនបម្រើ',
      inviteCode: 'កូដអញ្ជើញ',
      serverName: 'ឈ្មោះម៉ាស៊ីនបម្រើ',
      channels: 'ឆានែល',
      createChannel: 'បង្កើតឆានែល',
      channelName: 'ឈ្មោះឆានែល',
      channelType: 'ប្រភេទឆានែល',
      textChannel: 'ឆានែលអត្ថបទ',
      voiceChannel: 'ឆានែលសំឡេង',
      members: 'សមាជិក',
      roles: 'តួនាទី',
      createRole: 'បង្កើតតួនាទី',
      roleName: 'ឈ្មោះតួនាទី',
      permissions: 'ការអនុញ្ញាត'
    },
    directMessages: {
      title: 'សារផ្ទាល់ខ្លួន',
      new: 'សារផ្ទាល់ខ្លួនថ្មី',
      noConversations: 'មិនទាន់មានការសន្ទនានៅឡើយទេ',
      startConversation: 'ចាប់ផ្តើមការសន្ទនាជាមួយនរណាម្នាក់!'
    }
  },
  zh: {
    common: {
      welcome: '欢迎来到Discord聊天',
      login: '登录',
      register: '注册',
      logout: '登出',
      email: '电子邮件',
      password: '密码',
      username: '用户名',
      confirmPassword: '确认密码',
      submit: '提交',
      cancel: '取消',
      search: '搜索',
      settings: '设置',
      profile: '个人资料',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      create: '创建',
      join: '加入'
    },
    auth: {
      loginTitle: '登录您的账户',
      registerTitle: '创建一个账户',
      forgotPassword: '忘记密码？',
      noAccount: '没有账户？',
      hasAccount: '已有账户？',
      loginSuccess: '登录成功！',
      registerSuccess: '账户创建成功！',
      loginError: '电子邮件或密码无效',
      registerError: '注册失败'
    },
    chat: {
      newMessage: '新消息',
      typeMessage: '输入消息...',
      online: '在线',
      offline: '离线',
      idle: '闲置',
      dnd: '请勿打扰',
      typing: '正在输入...',
      edited: '已编辑',
      pinned: '置顶消息',
      reactions: '反应',
      addReaction: '添加反应',
      reply: '回复',
      files: '文件',
      noMessages: '还没有消息。开始对话！',
      loadMore: '加载更多消息'
    },
    servers: {
      createServer: '创建服务器',
      joinServer: '加入服务器',
      inviteCode: '邀请码',
      serverName: '服务器名称',
      channels: '频道',
      createChannel: '创建频道',
      channelName: '频道名称',
      channelType: '频道类型',
      textChannel: '文本频道',
      voiceChannel: '语音频道',
      members: '成员',
      roles: '角色',
      createRole: '创建角色',
      roleName: '角色名称',
      permissions: '权限'
    },
    directMessages: {
      title: '私信',
      new: '新私信',
      noConversations: '还没有对话',
      startConversation: '与某人开始对话！'
    }
  }
};

// Get user's preferred language from localStorage or browser settings
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('user-language');
  if (savedLanguage && Object.keys(languages).includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // Get from browser
  const browserLang = navigator.language.split('-')[0];
  if (Object.keys(languages).includes(browserLang)) {
    return browserLang;
  }
  
  return 'en'; // Default fallback
};

// Custom hook for i18n
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage());
  
  const changeLanguage = (langCode: keyof typeof languages) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('user-language', langCode);
      document.documentElement.lang = langCode;
      document.documentElement.dir = languages[langCode].dir;
      document.body.style.fontFamily = languages[langCode].font;
    }
  };
  
  useEffect(() => {
    // Set initial language
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = languages[currentLanguage as keyof typeof languages].dir;
    document.body.style.fontFamily = languages[currentLanguage as keyof typeof languages].font;
  }, [currentLanguage]);
  
  const t = (key: string) => {
    const keys = key.split('.');
    let translation: any = translations[currentLanguage as keyof typeof translations];
    
    for (const k of keys) {
      if (!translation[k]) {
        // Fallback to English if translation not found
        let fallback = translations.en;
        for (const fk of keys) {
          if (!fallback[fk]) {
            return key; // Return the key if no translation found even in fallback
          }
          fallback = fallback[fk];
        }
        return fallback;
      }
      translation = translation[k];
    }
    
    return translation;
  };
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    languages
  };
};