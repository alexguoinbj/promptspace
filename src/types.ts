export interface Folder {
  id: string;
  name: string;
  icon?: string; // Icon name from lucide
  color?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
  userPrompt: string;
  tags: string[];
  date: string;
  isFavorite?: boolean;
  folderId?: string;
}

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Cursor Rules 专家',
    description: '生成高质量的 Cursor/Windsurf AI 编程规则',
    systemPrompt: '你是一位 AI 辅助编程专家，精通 Cursor、Windsurf 等 AI IDE 的规则编写。你了解如何编写清晰、有效的 AI 编程指令，让 AI 更好地理解项目上下文和编码规范。',
    userPrompt: '请为我的 {{project_type}} 项目生成一份 Cursor Rules 文件：\n\n技术栈：{{tech_stack}}\n项目描述：{{description}}\n\n要求包含：\n1. 项目概述和目录结构说明\n2. 代码风格和命名规范\n3. 架构模式和设计原则\n4. 常用代码模板\n5. 禁止的实现方式\n6. 测试和文档要求',
    tags: ['AI编程', 'Cursor', '规则'],
    date: '2025/12/12 19:35:00',
    isFavorite: true,
    folderId: 'f1',
  },
  {
    id: '2',
    title: '代码审查专家',
    description: '专业代码审查，发现问题并给出改进建议',
    systemPrompt: '你是一位资深软件工程师，擅长进行代码审查。你会从代码质量、性能、安全性、可维护性等多个维度对代码进行评估。',
    userPrompt: '请审查以下代码，并给出详细的改进建议：\n\n```\n{{code}}\n```',
    tags: ['代码审查', '质量'],
    date: '2025/12/10 14:20:00',
    isFavorite: true,
    folderId: 'f1',
  },
  {
    id: '3',
    title: 'Git Commit 生成器',
    description: '根据代码变更生成规范的 commit 信息',
    systemPrompt: '你是一个 Git 专家，擅长编写符合 Conventional Commits 规范的 commit 信息。',
    userPrompt: '根据以下代码变更生成 commit 信息：\n\n{{diff}}',
    tags: ['Git', '工具'],
    date: '2025/12/08 09:15:00',
    folderId: 'f1',
  },
  {
    id: '4',
    title: 'Midjourney 摄影提示词',
    description: '生成写实的摄影风格绘图指令',
    systemPrompt: '你是一位专业的摄影师和 Midjourney 提示词专家。',
    userPrompt: '为以下场景生成 Midjourney 提示词：{{scene}}',
    tags: ['绘画', '摄影'],
    date: '2025/12/05 11:00:00',
    folderId: 'f3',
  },
];
