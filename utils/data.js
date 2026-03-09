// ========================================
// LISTE COMPLÈTE DES IMAGES - 40 PRODUITS
// 3 images par produit = 120 images au total
// ========================================

const productImages = {
  // ========================================
  // TYPE: HOMME
  // ========================================

  // ----- CHEMISES HOMME (7 produits) -----
  "Chemise Oxford Bleu Ciel": [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
  ],

  "Chemise Lin Blanc Cassé": [
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
    "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&q=80",
    "https://images.unsplash.com/photo-1598032895397-b9c0c8c5d3e9?w=800&q=80",
  ],

  "Chemise Carreaux Vichy Rouge": [
    "https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=800&q=80",
    "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80",
    "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80",
  ],

  "Chemise Slim Fit Noire": [
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    "https://images.unsplash.com/photo-1602810319250-a0f3c21fa5b1?w=800&q=80",
    "https://images.unsplash.com/photo-1594938328870-f5d455822d8f?w=800&q=80",
  ],

  "Chemise Denim Délavé": [
    "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800&q=80",
    "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
  ],

  "Chemise Rayures Fines Marine": [
    "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=800&q=80",
    "https://images.unsplash.com/photo-1603252109612-5234cc4da9c5?w=800&q=80",
    "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&q=80",
  ],

  "Chemise Flanelle Carreaux": [
    "https://images.unsplash.com/photo-1603320410149-db26ab7ebeba?w=800&q=80",
    "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80",
  ],

  // ----- PANTALONS HOMME (7 produits) -----
  "Jean Slim Brut Indigo": [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80",
  ],

  "Chino Beige Regular Fit": [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    "https://images.unsplash.com/photo-1598554794459-e6d6db6a4f5f?w=800&q=80",
  ],

  "Pantalon Costume Noir": [
    "https://images.unsplash.com/photo-1594938328870-f5d455822d8f?w=800&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
  ],

  "Cargo Kaki Multi-Poches": [
    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
  ],

  "Jean Straight Fit Noir": [
    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
  ],

  "Pantalon Jogging Gris Chiné": [
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    "https://images.unsplash.com/photo-1598662972299-fde2f394e152?w=800&q=80",
  ],

  "Chino Slim Marine": [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
  ],

  // ----- T-SHIRTS HOMME (6 produits) -----
  "T-shirt Col Rond Blanc": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  ],

  "T-shirt Col V Gris": [
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    "https://images.unsplash.com/photo-1602667639595-1f612f2d9357?w=800&q=80",
    "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80",
  ],

  "T-shirt Rayé Marine Blanc": [
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    "https://images.unsplash.com/photo-1622445275443-e24c7111d193?w=800&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
  ],

  "T-shirt Graphique Noir": [
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80",
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
  ],

  "T-shirt Polo Bordeaux": [
    "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80",
    "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800&q=80",
    "https://images.unsplash.com/photo-1594938328870-f5d455822d8f?w=800&q=80",
  ],

  "T-shirt Henley Bleu Nuit": [
    "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=800&q=80",
    "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
  ],

  // ========================================
  // TYPE: FEMME
  // ========================================

  // ----- ROBES FEMME (7 produits) -----
  "Robe Midi Fleurie": [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
  ],

  "Robe Fourreau Noire": [
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
    "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80",
  ],

  "Robe Maxi Bohème": [
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    "https://images.unsplash.com/photo-1617019114583-cacb66a3f80e?w=800&q=80",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
  ],

  "Robe Chemise Rayée": [
    "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=800&q=80",
  ],

  "Robe Cocktail Rouge": [
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  ],

  "Robe Trapèze Pastel": [
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
  ],

  "Robe Patineuse Dentelle": [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
    "https://images.unsplash.com/photo-1617019114583-cacb66a3f80e?w=800&q=80",
  ],

  // ----- CHEMISIERS FEMME (7 produits) -----
  "Chemisier Soie Crème": [
    "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80",
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    "https://images.unsplash.com/photo-1564257631407-fb6c7cac7620?w=800&q=80",
  ],

  "Chemisier Volants Rose Poudré": [
    "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800&q=80",
    "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
    "https://images.unsplash.com/photo-1603217039863-aa09a6a25da3?w=800&q=80",
  ],

  "Chemisier Blanc Classic": [
    "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80",
    "https://images.unsplash.com/photo-1564257631407-fb6c7cac7620?w=800&q=80",
    "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80",
  ],

  "Chemisier Imprimé Léopard": [
    "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=800&q=80",
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80",
  ],

  "Chemisier Brodé Beige": [
    "https://images.unsplash.com/photo-1603217039863-aa09a6a25da3?w=800&q=80",
    "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
    "https://images.unsplash.com/photo-1564257631407-fb6c7cac7620?w=800&q=80",
  ],

  "Chemisier Cache-Cœur Noir": [
    "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=800&q=80",
    "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80",
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
  ],

  "Chemisier Satin Émeraude": [
    "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800&q=80",
    "https://images.unsplash.com/photo-1603217039863-aa09a6a25da3?w=800&q=80",
    "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80",
  ],

  // ----- JUPES FEMME (6 produits) -----
  "Jupe Crayon Grise": [
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  ],

  "Jupe Plissée Midi Bordeaux": [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    "https://images.unsplash.com/photo-1617019114583-cacb66a3f80e?w=800&q=80",
  ],

  "Jupe Patineuse Noire": [
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80",
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
  ],

  "Jupe Longue Bohème": [
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    "https://images.unsplash.com/photo-1617019114583-cacb66a3f80e?w=800&q=80",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
  ],

  "Jupe Jean Boutonnée": [
    "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80",
    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
  ],

  "Jupe Tulle Rose Pâle": [
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
  ],
};

// ========================================
// EXPORT ET INSTRUCTIONS
// ========================================

console.log("========================================");
console.log("📸 LISTE COMPLÈTE DES IMAGES PRODUITS");
console.log("========================================");
console.log("");
console.log("✅ 40 produits");
console.log("✅ 3 images par produit");
console.log("✅ 120 images au total");
console.log("");
console.log("========================================");
console.log("📝 INSTRUCTIONS");
console.log("========================================");
console.log("");
console.log("1. Copier les URLs ci-dessus");
console.log("2. Pour chaque produit :");
console.log("   - Ouvrir chaque URL dans le navigateur");
console.log("   - Clic droit > Enregistrer l'image sous...");
console.log("   - Nommer : produit_1.jpg, produit_2.jpg, produit_3.jpg");
console.log("");
console.log("3. Upload via l'interface admin :");
console.log("   - Aller sur /admin/products");
console.log("   - Cliquer sur l'icône Images 🖼️");
console.log("   - Upload avec Cloudinary Widget");
console.log("");
console.log("========================================");
console.log("🚀 MÉTHODE RAPIDE (SCRIPT)");
console.log("========================================");
console.log("");
console.log("Utilisez ce JSON pour un script d'upload automatique :");
console.log(JSON.stringify(productImages, null, 2));
console.log("");
console.log("Vous pouvez créer un script Node.js qui télécharge");
console.log("automatiquement toutes ces images et les upload vers");
console.log("Cloudinary en utilisant ce JSON.");
console.log("");

// Export du JSON complet
export default productImages;
