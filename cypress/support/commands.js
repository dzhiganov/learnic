Cypress.Commands.add(
  'clearFirebaseAuth',
  () =>
    new Cypress.Promise(async (resolve) => {
      const req = indexedDB.deleteDatabase('firebaseLocalStorageDb');
      req.onsuccess = () => {
        resolve();
      };
    })
);
