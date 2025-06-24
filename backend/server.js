const app = require('./app');
const PORT = process.env.PORT || 5500;

// Initialize sample data
const initializeData = require('./utils/initializeData');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  initializeData();
});