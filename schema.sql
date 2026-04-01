-- Supabase 数据库表结构定义脚本

-- 创建 Folders 表
CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建 Prompts 表
CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT,
  user_prompt TEXT,
  tags TEXT[],
  date TEXT,
  is_favorite BOOLEAN DEFAULT false,
  folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 设置RLS等安全策略(可选)
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- 创建基于用户的 RLS 策略
CREATE POLICY "Users can manage their own folders" ON folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own prompts" ON prompts FOR ALL USING (auth.uid() = user_id);
