const request = require('supertest');
const { app, Incident } = require('../main');

const mockIncidents = [
  { sujet: "Accident de voiture", description: "Collision à Paris", ville: "Paris" },
  { sujet: "Inondation", description: "Eau dans le sous-sol", ville: "Lyon" },
  { sujet: "Panne électrique", description: "Plusieurs immeubles sans courant", ville: "Marseille" }
];

describe("GET /search", () => {

  //avant de faire tous les tests on vide la collection et on insère des incidents de test
  beforeAll(async () => {
    await Incident.deleteMany({}); //supprime tous les incidents existants
    await Incident.insertMany([
      { sujet: "Accident voiture", description: "Collision à Paris", ville: "Paris" },
      { sujet: "Inondation", description: "Sous-sol inondé", ville: "Lyon" },
      { sujet: "Accident grave", description: "Accident sur l'autoroute", ville: "Bruxelles" },
    ]);
  });

  //on vérifie que la route renvoie un statut HTTP 200
  test("doit renvoyer 200 OK", async () => {
    const response = await request(app)
      .get('/search')
      .query({ keyword: "Accident" });
    expect(response.status).toBe(200);
  });

  //on vérifie que le mot-clé renvoie le bon incident
  test("doit contenir l'incident correspondant au mot-clé", async () => {
    const response = await request(app)
      .get('/search')
      .query({ keyword: "Accident" });
    expect(response.text).toContain("Accident voiture");
    expect(response.text).toContain("Accident grave");
  });

  //on vérifie que la recherche n'est pas sensible à la casse
  test("la recherche doit être insensible à la casse", async () => {
    const response = await request(app)
      .get('/search')
      .query({ keyword: "INONDATION" });
    expect(response.text).toContain("Inondation");
  });

  //on vérifie que les résultats sont triés par pertinence (TF-IDF décroissant)
  test("les résultats doivent être classés par pertinence", async () => {
    const response = await request(app)
      .get('/search')
      .query({ keyword: "Accident" });

    //on récupère tous les titres des incidents renvoyés
    const regex = /<h3>Sujet: (.*?)<\/h3>/g;
    let match;
    const sujets = [];
    while ((match = regex.exec(response.text)) !== null) {
      sujets.push(match[1]);
    }

    //on s'attend à ce que "Accident grave" (plus de occurrences du mot) apparaisse avant "Accident voiture"
    expect(sujets.indexOf("Accident grave")).toBeLessThan(sujets.indexOf("Accident voiture"));
  });

});