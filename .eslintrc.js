// .eslintrc.js
module.exports = {
  extends: [
    'react-app', // Hereda la configuración base de Create React App (ya incluye react-hooks)
    'react-app/jest'
    // Eliminamos 'plugin:react-hooks/recommended' ya que react-app ya lo incluye
  ],
  // Eliminamos la sección de plugins que duplica react-hooks
  rules: {
    // Puedes mantener las reglas específicas aunque elimines el plugin duplicado
    'react-hooks/exhaustive-deps': 'warn'
  }
};