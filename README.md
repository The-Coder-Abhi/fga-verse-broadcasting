# VerseView Broadcasting 🚀

An automated system designed for broadcasting text and lyrics seamlessly to a web interface in real time. This project serves as a dynamic display solution, ideal for live environments where instantly synced, high-visibility text rendering is essential.

## 📸 Screenshots

<table>
  <tr>
   <td align="center">
      <b>Splash Screen</b><br>
      <img src="https://github.com/user-attachments/assets/5e4ccd1b-eb23-48b9-87f5-f36b66f6cb0a" width="100%"/>
    </td>
  </tr>
  <tr>
   <td align="center">
      <b>Live Broadcast Interfac 01</b><br>
      <img src="https://github.com/user-attachments/assets/189bfc6d-90bb-44e2-9f9f-4274706de090" width="100%"/>
    </td>
  </tr>
  <tr>
   <td align="center">
      <b>Live Broadcast Interface 02</b><br>
      <img src="https://github.com/user-attachments/assets/7152521c-3801-4d31-881d-5f4378022330" width="100%"/>
    </td>
  </tr>
  <tr>
   <td align="center">
      <b>Live Broadcast Interface 03</b><br>
      <img src="https://github.com/user-attachments/assets/65a70b9c-2e4f-4ca0-a9f1-141d4e8c73fd" width="100%"/>
    </td>
  </tr>
</table>

## 🌟 Core Features
* **Real-Time Data Synchronization:** Leveraging a cloud database to broadcast lyrics and textual changes instantaneously across all connected clients without page refreshes.
* **Auto-Scaling Text Hooks:** Custom frontend logic that dynamically calculates screen real estate and scales text up or down automatically, ensuring long verses never overflow and remain perfectly readable on any display size.
* **Polished User Experience:** Features a clean web splash screen for seamless initial asset loading and connection establishment.

## 🛠️ Tech Stack
* **Frontend:** React.js, Custom CSS / Layout Hooks
* **Backend / Database:** Firebase (Realtime Database / Firestore, Hosting)

## 🏗️ Technical Highlights
* **Dynamic Typography:** Built custom React hooks to manage auto-scaling text properties dynamically based on view window dimensions, mitigating standard CSS break-points for fluid typography.
* **State Management:** Integrated real-time data listeners to minimize latency between the controller input and the public broadcast view.

## 💻 Getting Started

Follow these steps to run the broadcasting system locally.

### Prerequisites
* Node.js (v16+ recommended)
* A Firebase account and project set up

### Installation & Setup

1. **Clone the repository:**
   git clone https://github.com/The-Coder-Abhi/fga-verse-broadcasting.git
   cd fga-verse-broadcasting
