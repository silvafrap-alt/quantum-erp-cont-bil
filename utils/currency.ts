
export const formatCurrency = (value: number, currencyCode: string = 'BRL', minimumFractionDigits = 2) => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: minimumFractionDigits,
    };

    // Use a try-catch block in case the currency code is not supported by the browser
    try {
        return new Intl.NumberFormat('pt-BR', options).format(value);
    } catch (error) {
        console.warn(`Currency formatting failed for code: ${currencyCode}. Defaulting to BRL.`);
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
};
