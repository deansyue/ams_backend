# 出勤管理系統-後端
本專案為前、後端分離開發專案，本專案為簡易出勤打卡網站，此部分Repository專為處理使用者發送之請求、依據需求回傳資料庫內的相關JSON格式資料。


## Features 產品功能
* 使用者/管理者登入系統,回傳登入結果
  * 登入成功回傳帳號的使用者及公司資料
  * 使用者登入成功重置登入錯誤次數
  * 使用者判斷連續輸入錯誤5次以上,更新使用者上鎖狀態
* 使用者打卡,前端傳入的打卡時間，來決定寫入的打卡日期，並判定是否正常出勤
  * 一天打卡日為該時間區當日5:00A.M至隔日4:59A.M
  * 打卡日期第一次傳入為上班打卡,新增資料庫資料,寫入上班相關資料
  * 第二次含以後打卡為下班打卡,更新該打卡日期下班相關資料
* 使用者修改密碼,判斷前端傳入的原密碼與資料庫是否吻合,且更新資料庫傳入帳號密碼
* 使用者QRcode產生,回傳帳號公司的地理資訊
* 使用者QRcode產生,判斷是否存在使用者且傳入的日期是否與當日為同一天，若是執行打卡方法
* 回傳當前使用者帳號的使用者及公司資料
* 依前端使用者傳入的日期區間,回傳行事曆及使用者打卡資料
* 依前端管理者傳入資料,更新公司資料
* 回傳被上鎖員工資料給管理者
* 依前端管理者傳入的員工編號,解鎖員工上鎖狀態

## Environment Setup 環境建置
* Node.js
* express
* mysql2
* sequelize
* passport-jwt

## Installing 專案安裝流程
1. 打開您的終端機(terminal)，複製(clone)專案至本機
```
git clone https://github.com/deansyue/ams_backend.git
```

2. 進入存放此專案資料夾
```
cd ams_backend
```

3. 安裝npm套件
```
npm install
```

4. 將.env.example 改為.env，並設定為自己的資料
```
PORT=SKIP
JWT_SECRET=SKIP 
```

5. 使用MySQL介面程式，建立資料庫，並設定資料庫相關資訊與config/config.json一致
```
create database AMS;
```

6. 建立資料表
```
npx sequelize db:migrate
```

7. 創建種子資料
```
npx sequelize db:seed:all
```

8. 使用腳本，即可啟動伺服器
```
npm run start
```

9. 當終端機(terminal)出現以下文字，代表伺服器已啟動
```
app listening on port: !
```

## 種子資料使用者
可使用種子資料新增的使用者操作本專案

### 管理者帳號：
```
admin
  account: admin
  password: tiadmin
```

### 使用者帳號：
```
user1
  account: user1
  password: titaner

user2
  account: user2
  password: titaner

user3
  account: user3
  password: titaner
```

## Related Links 相關連結
### 前端
[Github](https://github.com/deansyue/ams_frontend)


## Contributor 專案開發人員
[deansyue](https://github.com/deansyue)