export const rules = {
    required: v => !!v || 'Champ obligatoire !',
    emailFormat:   v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'format email invalide !'
}
