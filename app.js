// Система аккаунтов и баланса
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
            
            // Инвентарь пустой
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
    
    getInventory() {
        const inventory = localStorage.getItem(`kudoz_inventory_${this.userId}`);
        return JSON.parse(inventory || '[]');
    }
    
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
    
    // Таймер обратного отсчета
    function updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const now = new Date();
            const nextFree = new Date(now);
            nextFree.setHours(now.getHours() + 1, 0, 0, 0);
            
            const diff = nextFree - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Обновляем таймер каждую секунду
    updateTimer();
    setInterval(updateTimer, 1000);
    
    // Функция пополнения (демо)
    window.deposit = function() {
        const account = window.kudoZAccount;
        const currentBalance = account.getBalance();
        const newBalance = account.updateBalance(100);
        
        alert(`✅ 100 звёзд добавлено! Новый баланс: ${newBalance} ⭐`);
    };
});
