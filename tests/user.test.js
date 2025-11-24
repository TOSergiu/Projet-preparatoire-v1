const checkUserInput = require('../checkInput.js');


//test pour les noms
describe("isValidUsername", () =>{
    test("Returns false when username is shorter than 6 characters", () => {
        expect(checkUserInput.isValidUsername("abcde")).toBe(false);
        expect(checkUserInput.isValidUsername("12345")).toBe(false);
    });

    test("Returns true when username is longer or equal to 6 characters", () => {
        expect(checkUserInput.isValidUsername("abcdefg")).toBe(true);
        expect(checkUserInput.isValidUsername("1234567")).toBe(true);
    });

    test("Handles 6 character usernames", () => {
        expect(checkUserInput.isValidUsername("abcdef")).toBe(true);
        expect(checkUserInput.isValidUsername("123456")).toBe(true);
    });

    test("Handles empty strings", () => {
        expect(checkUserInput.isValidUsername("")).toBe(false);
    });
});

//tests pour les mots de passses
describe("isValidPassword", () =>{
    test("Returns false when password is shorter than 7 characters", () => {
        expect(checkUserInput.isValidPassword("abcde")).toBe(false);
    });

    test("Returns true when password is longer or equal to 7 characters", () => {
        expect(checkUserInput.isValidPassword("Abcdef1!")).toBe(true);
    });

    test("Handles empty strings", () => {
        expect(checkUserInput.isValidPassword("")).toBe(false);
    });

    test("Returns false when missing an upper case", () => {
        expect(checkUserInput.isValidPassword("password1!")).toBe(false);
    });

    test("Returns false when missing a special character", () => {
        expect(checkUserInput.isValidPassword("Password1")).toBe(false);
    });

    test("Returns false when missing a number", () => {
        expect(checkUserInput.isValidPassword("Password!")).toBe(false);
    });

    test("Returns true when requirements met", () => {
        expect(checkUserInput.isValidPassword("Password1!")).toBe(true);
    });
});

//tests pour l'address email
describe("isValidEmail", () =>{
    test("Returns false when email has less than 5 characters", () => {
        expect(checkUserInput.isValidEmail("ab")).toBe(false);
    });

    test("Returns true when email has more than 5 characters", () => {
        expect(checkUserInput.isValidEmail("abcde@f.com")).toBe(true);
    });

    test("Handles empty strings", () => {
        expect(checkUserInput.isValidEmail("")).toBe(false);
    });

    test("Handles '@' count", () => {
        expect(checkUserInput.isValidEmail("@@")).toBe(false);
        expect(checkUserInput.isValidEmail("a@b.com")).toBe(true);
    });
});