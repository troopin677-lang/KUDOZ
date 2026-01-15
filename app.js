// Система аккаунтов и баланса для рулетки подарков
class KudoZAccount {
    constructor() {
        this.initUser();
    }
    
    initUser() {
        // Генерируем ID пользователя если нет
        let userId = localStorage.getItem('kudoz_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('kudoz_user_id', userId);
            
            // Начальный баланс
            localStorage.setItem(`kudoz_balance_${userId}`, '400');
            
            // Количество побед
            localStorage.setItem('kudoz_wins', '0');
            
            // Инвентарь подарков
            localStorage.setItem(`kudoz_inventory_${userId}`, JSON.stringify([]));
        }
        
        this.userId = userId;
    }
    
    getBalance() {
        const balance = localStorage.getItem(`kudoz_balance_${this.userId}`);
        return parseInt(balance || '400');
    }
    
    updateBalance(change) {
        const current = this.getBalance();
        const newBalance = Math.max(0, current + change);
        localStorage.setItem(`kudoz_balance_${this.userId}`, newBalance);
        
        // Обновляем на всех страницах
        this.updateBalanceDisplay(newBalance);
        return newBalance;
    }
    
    updateBalanceDisplay(balance) {
        document.querySelectorAll('#balance').forEach(el => {
            if (el) el.textContent = balance;
        });
    }
    
    // Получить количество побед
    getWins() {
        return parseInt(localStorage.getItem('kudoz_wins') || '0');
    }
    
    // Добавить победу
    addWin() {
        let wins = this.getWins();
        wins++;
        localStorage.setItem('kudoz_wins', wins);
        return wins;
    }
    
    // Получить инвентарь
    getInventory() {
        const inventory = localStorage.getItem(`kudoz_inventory_${this.userId}`);
        return JSON.parse(inventory || '[]');
    }
    
    // Добавить в инвентарь
    addToInventory(item) {
        const inventory = this.getInventory();
        inventory.push(item);
        localStorage.setItem(`kudoz_inventory_${this.userId}`, JSON.stringify(inventory));
        return inventory;
    }
}

// Глобальный аккаунт
window.kudoZAccount = new KudoZAccount();

// Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем баланс
    const account = window.kudoZAccount;
    account.updateBalanceDisplay(account.getBalance());
    
    // Функция пополнения (демо)
    window.deposit = function(amount) {
        const account = window.kudoZAccount;
        const newBalance = account.updateBalance(amount);
        
        alert(`✅ ${amount} звёзд добавлено!\nНовый баланс: ${newBalance} ⭐`);
    };
    
    window.depositStars = function(amount) {
        deposit(amount);
    };
});
