# 🎭 Mafia Mayhem

**Mafia Mayhem** is a local multiplayer social deduction game built entirely in the browser using **Vite**. Inspired by the classic Mafia party game, this app is designed for pass-and-play on a single device. Gather your friends, assign secret roles, and find out who you can trust.

---

## 🌐 Play Online or Download

- ▶️ **Play Now:** [Mafia Mobile Mayhem](https://mafia-mobile-mayhem.vercel.app/)  
- 📱 **Download APK:** [Download Mafia Mayhem APK](https://github.com/Siddhantshukla1657/mafia-mobile-mayhem/blob/main/Mafia%20Mobile%20Mayhem.apk)

## 🚀 Features

- 🔢 Choose number of players
- 👥 Enter player names
- 🎭 Assign secret roles: **Villager**, **Cop**, **Mafia**, **Healer**
- 🌙 **Night phase**: Each player secretly performs their role action
- ☀️ **Day phase**: Reveal what happened, discuss, and vote out a suspect
- 🧠 Simple logic to guide the flow of the game
- ✅ All in-browser — **no backend** required
- 📦 App is also availabel for android

---

## 🧩 Roles & Actions

| Role      | Description                              | Night Action                              |
|-----------|------------------------------------------|-------------------------------------------|
| Villager  | No special ability                       | Pass the device to the next player        |
| Mafia     | Secretly work together to kill others    | Select one player to eliminate            |
| Cop       | Can investigate one player per night     | Choose one player to suspect              |
| Healer    | Can protect one player per night         | Choose one player to heal (save)          |

---

## 🏆 Win Conditions

- **Villagers Win**: All Mafia have been eliminated.
- **Mafia Wins**: Number of Mafia ≥ Number of remaining players.

---

## 🎮 How to Play

1. **Start Game**
   - Select the total number of players.
   - Enter the name for each player.

2. **Assign Roles**
   - Choose how many **Villagers**, **Cops**, **Mafia**, and **Healers** to include.
   - Roles are randomly assigned and shown secretly to each player during their turn.

3. **Night Phase**
   - Each player taps to reveal their role.
     - **Villager**: Just pass the device.
     - **Mafia**: Choose a player to eliminate.
     - **Cop**: Choose a player to investigate.
     - **Healer**: Choose a player to heal.
   - Pass the device to the next player.

4. **Day Phase**
   - The app reveals:
     - Who was killed (unless healed).
     - Whether the **Cop** guessed correctly.
     - Whether the **Healer** healed correctly.
   - Players discuss and vote out one person.

5. **Repeat**
   - Night and Day phases repeat until one side wins.

---

## ⚙️ Tech Stack

- [Vite](https://vitejs.dev/) – Lightning-fast frontend tooling
- React
- HTML + CSS  

> 📝 **No backend, no database** — All data is stored in memory in the browser for a seamless offline experience.

---
