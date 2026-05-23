# Draft: NCKU Study Next-S 重構計畫

## 已確認的事實 (from codebase exploration)

### 來源專案
- **Legacy**: `NCKU_Trans` — Laravel 6 + React 16 + styled-components + MUI
- **視覺參考**: `ncku-study-next/app/frontend` — Vite + React 18 + MUI + Bootstrap + Redux + Tailwind v4 (已加入但未完全遷移)
- **Next.js 參考**: `ncku-study-next/app/next` — Next 16.1.1 + React 19 + Tailwind v4 (極簡，只有 layout + page)
- **DB 型別**: `ncku-study-next/app/database-bff/src/db.ts` — 完整 Kysely 型別定義

### 目標目錄
- `ncku-study-next-s/ncku-study-next-s` — 尚不存在，需建立

### 技術棧 (明確要求)
- Next.js + Tailwind CSS + Kysely + mysql2
- Auth.js (authjs)
- React Query (TanStack)
- i18n (wording JSON 已存在於參考專案)
- shadcn/ui 或原生 React components (取代 MUI / React Bootstrap)
- MSW mock server (參考 ncku-study-next/packages/mocks 的邏輯)

### API 端點 (from Laravel routes + MSW handlers)
**Public:**
- GET /api/v2/comments (major list, confirm=true)
- POST /api/v2/comments (create major)
- GET /api/v2/comments/all (admin, JWT required)
- GET /api/v2/departments, /api/v2/colleges
- GET /api/v2/announcements
- GET /api/v2/studies (public list)
- GET /api/v2/studies/result
- GET /api/v2/categories
- GET /api/v2/statistics
- POST /api/v2/user/login, /register, /logout, /refresh

**Protected (JWT):**
- PUT/PATCH/DELETE /api/v2/comments/:id
- GET/PUT/DELETE /api/v2/studies/all, studies/:id
- CRUD /api/v2/departments, /colleges, /categories, /statistics, /announcements

**需新增:**
- GET /api/v2/studies/:id (single study by id — 目前 MSW 無此 endpoint)
- GET /api/v2/comments/:id (single comment by id — 同上)

### DB Schema (Kysely types)
- `major`: id, category, rank_1, rank_2, year, score, isPass, out_maj, in_maj, department, comment, confirm
- `department`: id, name, college
- `college`: id, name
- `announcement`: id, msg, isShow, created_at, updated_at
- `major_qa`: id, question, answer, tag, confirm
- `standard`: id, year, link
- `Study`: id(UUID), title, content, year, major, confirm, created_at, updated_at
- `CategoryManage`: id(UUID), name
- `Category`: id(UUID), study_id
- `StatisticManage`: id(UUID), name, dataType, max, min
- `OtherStatistic`: id(UUID), name, value, study_id

### 頁面路由 (從參考 router.jsx)
- `/` 或 `/major` → Major (轉系心得)
- `/study` → Study (學業心得)
- `/post` → Post (發文)
- `/admin/login` → Login
- `/admin/study`, `/admin/major`, `/admin/post` → Admin pages
- `/admin/department`, `/admin/announcement` → Admin pages
- **新增**: `/study/[id]` → Single Study (SSR modal content)
- **新增**: `/major/[id]` → Single Major (SSR modal content)

### SSR/CSR 分配
- all major / study (confirm=true list): sidebar=SSR, 其餘=CSR
- single major / study: sidebar+modal content=SSR, 背景列表=CSR
- 其他頁面: sidebar=SSR, 其餘=CSR

### i18n 文字
- `wording/general.json`, `wording/major.json`, `wording/toggleRemark.json`

### 3 種運行模式
- `npm run dev`: Next.js dev + MSW mock (無真實 DB)
- `npm run dev:uat`: Next.js dev + local MySQL (Kysely direct)
- `npm run prod`: Next.js production build + local MySQL

## 待確認的問題

### Q1: 專案結構
- 單一 Next.js app？還是 pnpm monorepo (含獨立 mocks package)？
- 建議: 單一 Next.js app (簡單，符合 standalone git repo)，mocks 內建在 app 中

### Q2: Next.js 版本
- 參考 app/next 使用 Next 16.1.1 + React 19。是否跟隨？
- 建議: 是，使用 Next 15 或 16 + React 19

### Q3: shadcn/ui
- 要用哪些 shadcn components？
- 建議: Button, Input, Select, Dialog (modal), Sheet (drawer/sidebar), Badge, Card

### Q4: i18n library
- next-intl vs react-i18next？
- 建議: next-intl (Next.js 原生整合最好)

### Q5: Auth.js 策略
- Credentials provider (email/password)？還是其他？
- 建議: Credentials provider，保持和原本相同的 email/password 流程

### Q6: SST
- 參考 app/next 使用 SST。新專案是否需要 SST？
- 建議: 不需要，用 plain `next dev`

### Q7: React Query 版本
- v5？
- 建議: v5

### Q8: 是否重用 database-bff 的 Kysely types
- 建議: 直接複製 db.ts 到新專案的 lib/ 下，不設 workspace 依賴

## 決策紀錄
(待填)
