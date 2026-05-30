class AuthProxy {
    constructor(authStrategy) {
        this.authStrategy = authStrategy;
        this.requestCount = 0;
        this.rateLimit = 5;
    }

    setAuthStrategy(authStrategy) {
        this.authStrategy = authStrategy;
    }

    async request(url, options = {}) {
        if (this.requestCount >= this.rateLimit) {
            throw new Error("Перевищено ліміт запитів");
        }

        this.requestCount++;

        const modifiedOptions = {
            ...options,
            headers: {
                ...(options.headers || {}),
                ...this.authStrategy.getAuthHeaders()
            }
        };

        console.log("Виконується запит до:", url);
        console.log("Метод:", modifiedOptions.method || "GET");
        console.log("Заголовки авторизації:", modifiedOptions.headers);

        return fakeApiRequest(url, modifiedOptions);
    }
}

class ApiKeyAuth {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    getAuthHeaders() {
        return {
            "X-API-Key": this.apiKey
        };
    }
}

class JwtAuth {
    constructor(token) {
        this.token = token;
    }

    getAuthHeaders() {
        return {
            "Authorization": `Bearer ${this.token}`
        };
    }
}
