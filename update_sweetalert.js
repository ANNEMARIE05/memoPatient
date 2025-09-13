const fs = require('fs');
const path = require('path');

// Liste des fichiers à modifier
const filesToUpdate = [
  'src/views/AppointmentsPage.vue',
  'src/views/MedicalRecordsPage.vue',
  'src/views/ProfilesPage.vue',
  'src/views/UserDetailPage.vue',
  'src/views/PatientDetailPage.vue',
  'src/views/MessageTemplateDetailPage.vue',
  'src/views/MessageHistoryDetailPage.vue',
  'src/views/AppointmentDetailPage.vue',
  'src/views/MedicalRecordDetailPage.vue'
];

// Fonction pour ajouter l'import SweetAlert2
function addSweetAlertImport(content) {
  // Vérifier si SweetAlert2 est déjà importé
  if (content.includes("import Swal from 'sweetalert2'")) {
    return content;
  }
  
  // Trouver la dernière ligne d'import
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, "import Swal from 'sweetalert2'");
  }
  
  return lines.join('\n');
}

// Fonction pour remplacer les fonctions de suppression
function updateDeleteFunctions(content) {
  // Patterns à remplacer
  const patterns = [
    {
      // Pattern pour les fonctions delete avec confirm()
      regex: /const\s+(delete\w+)\s*=\s*\([^)]+\)\s*=>\s*{\s*if\s*\(\s*confirm\([^)]+\)\s*\)\s*{\s*([^}]+)\s*}\s*}/g,
      replacement: (match, funcName, body) => {
        return `const ${funcName} = async (item) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    text: 'Cette action est irréversible.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Non, annuler'
  })

  if (result.isConfirmed) {
    ${body.replace(/window\.showNotification\([^)]+\)/g, '')}
    await Swal.fire({
      title: 'Supprimé !',
      text: 'L\'élément a été supprimé avec succès.',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }
}`;
      }
    }
  ];
  
  let updatedContent = content;
  
  patterns.forEach(pattern => {
    updatedContent = updatedContent.replace(pattern.regex, pattern.replacement);
  });
  
  return updatedContent;
}

// Traiter chaque fichier
filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`Traitement de ${filePath}...`);
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Ajouter l'import SweetAlert2
    content = addSweetAlertImport(content);
    
    // Mettre à jour les fonctions de suppression
    content = updateDeleteFunctions(content);
    
    // Écrire le fichier modifié
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`✓ ${filePath} mis à jour`);
  } else {
    console.log(`⚠ ${filePath} non trouvé`);
  }
});

console.log('Mise à jour terminée !');
