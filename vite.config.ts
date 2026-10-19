import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages（プロジェクトサイト）では /<repo>/ 配下で配信されるため、Actions から渡す
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
