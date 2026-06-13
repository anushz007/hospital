const fs = require('fs');
const path = require('path');
const https = require('https');

const screens = [
  {
    title: "Patient_Dashboard_Small",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzY4Zjc2MjljYzk1MTRlMzc4MmIxOGYyNDc0MGIxZGNmEgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Doctor_Profile_Dr_James_Wilson",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NDEwODAzNjhjMTAwMzgzOTEwYzk1MDBlODZhEgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Login_and_Role_Selection",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NDEwNWVlOTE2MzkwMDMwMzQ1ZWMzMTczMjk5EgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Select_Department",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NDEwNWYxZDRlYTYwMzM4NGU0NGM1MThiYTZiEgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Admin_Dashboard",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NDEwNWVhMmU5ZjEwNzc5OWVjYmIwMTBkNGQ2EgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Patient_Dashboard_Large",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NDEwNWViYzc0YTQwMzgzOWNmMzRmMDUyOThkEgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Doctor_Dashboard",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NDEwNWVmOGZhOTQwNzc5OWVjYmIwMTBkNGQ2EgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Medical_Records",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NDEwNWYwOGY0MjgwODhlYmE0MDM5Mjk5YjAxEgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  },
  {
    title: "Secure_Payment",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzRkZGQ4YzdlNjY2NjQ5N2NhYThkYTM0ZDA3ZGNjZmE5EgsSBxCwl-q_vA8YAZIBIwoKcHJvamVjdF9pZBIVQhM0MTIyNjY4OTMzMDEzMTI0MDk5&filename=&opi=89354086"
  }
];

const outputDir = path.join(__dirname, 'downloaded_screens');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirect
        download(res.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${url}: ${err.message}`);
      reject(err);
    });
  });
}

async function run() {
  for (const screen of screens) {
    const filePath = path.join(outputDir, `${screen.title}.html`);
    try {
      await download(screen.url, filePath);
    } catch (err) {
      console.error(`Failed to download ${screen.title}`);
    }
  }
  console.log('All downloads completed!');
}

run();
