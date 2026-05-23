- 以nextjs, tailwindcss, kysely, mysql2在`ncku-study-next-s`完全重構 `C:\Users\at5lp\Documents\project\ncku-study-next-ws\NCKU_Trans`的前後端。
- 分為開發模式, 預覽開發模式跟production模式
  - 開發模式(`npm run dev`): 以local dev server存取mock SQL server
  - 預覽開發模式(`npm run dev:uat`): 以local dev server存取local SQL server
  - production模式(`npm run prod`): 以local production mode server存取local SQL server
- Tailwind css以及適合其的dom已經重構在 `C:\Users\at5lp\Documents\project\ncku-study-next-ws\ncku-study-next\app\frontend`，請參考其中的style和dom架構。不要有任何native css或css in js
- 請把所有的MUI和React boostrap重構成原生React或是shadcn component。必要時請參考node_modules內的原始碼
- 最終計算出來的style和UI流程必須和 `C:\Users\at5lp\Documents\project\ncku-study-next-ws\ncku-study-next\app\frontend` 完全一致，不可以有超過1%差異。以Playwright cli驗證。
- CSR和SSR的分配
   - all major and study (confirm = true): 除側邊nav為SSR外皆為CSR
   - single major and study: 側邊nav和modal內單一心得的內容為SSR，背景心得列表為CSR
      - 必須新增以id獲取單一心得的api已達成此功能
      - 使用者可透過with id的url直接進到此頁面
   - 其餘頁面側邊nav為SSR，剩下的內容皆為CSR
- Mock server請參考 `C:\Users\at5lp\Documents\project\ncku-study-next-ws\ncku-study-next\packages`中的邏輯
- 登入頁面和後端驗證邏輯請用 authjs 重作
- 所有http request都要透過React query(tanstack)
- 所有UI內的文字都要使用i18n，文字都要和原本的專案相同
- commit前，先檢查有沒有ts和lint error
- 請做到一定程度就自己commit，commit規範為
```
<type>: <subject>

Type
Must be one of the following:

build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
ci: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
docs: Documentation only changes
feat: A new feature
fix: A bug fix
perf: A code change that improves performance
refactor: A code change that neither fixes a bug nor adds a feature
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
test: Adding missing tests or correcting existing tests

Subject
The subject contains a succinct description of the change:

use the imperative, present tense: "change" not "changed" nor "changes"
don't capitalize the first letter
no dot (.) at the end
```

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.