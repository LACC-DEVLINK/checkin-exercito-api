// qr-codes/templates/qr-card.template.ts

// Supondo que você tenha esses dados do militar
interface MilitaryData {
  name: string;
  rank: string; // Posto/Graduação
  idNumber: string; // Número de identidade
  photoUrl: string; // URL da foto do militar
  qrCodeDataUrl: string; // QR Code em base64
}

export const getQrCardTemplate = (data: MilitaryData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cartão de Identificação</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        
        body {
          font-family: 'Roboto', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f2f5;
        }
        .card {
          width: 350px;
          height: 550px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-top: 10px solid #004d40;
          text-align: center;
        }
        .header {
          font-size: 1.2em;
          font-weight: 700;
          color: #333;
          margin-bottom: 20px;
        }
        .profile-pic {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid #e0e0e0;
          margin-bottom: 20px;
        }
        .info h2 {
          margin: 0;
          font-size: 1.5em;
          color: #263238;
        }
        .info p {
          margin: 5px 0;
          font-size: 1.1em;
          color: #555;
        }
        .qr-code {
          margin-top: 30px;
        }
        .qr-code img {
          width: 180px;
          height: 180px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">EXÉRCITO BRASILEIRO</div>
        <img src="${data.photoUrl}" alt="Foto do Militar" class="profile-pic">
        <div class="info">
          <h2>${data.name}</h2>
          <p>${data.rank}</p>
          <p>ID: ${data.idNumber}</p>
        </div>
        <div class="qr-code">
          <img src="${data.qrCodeDataUrl}" alt="QR Code">
        </div>
      </div>
    </body>
    </html>
  `;
};