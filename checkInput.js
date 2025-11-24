const checkUserInput = {

    isValidUsername : function(input) {
        if (input.length < 6) {
            return false;
        }
        return true;
    },

    isValidPassword: function (input) {
        if (input.length < 7) return false;

        const hasUppercase = /[A-Z]/.test(input);
        const hasNumber = /[0-9]/.test(input);
        const hasSpecial = /[^A-Za-z0-9]/.test(input);

        return hasUppercase && hasNumber && hasSpecial;
    },

    isValidEmail : function(input) {
        if(input.length < 5) return false;
        if(input.includes(" ")) return false;

        const parts = input.split('@');
        if(parts.length !== 2) return false;

        return true;
    }

}

module.exports = checkUserInput;
