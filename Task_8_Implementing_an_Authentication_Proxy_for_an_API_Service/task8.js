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

class OAuthAuth {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    getAuthHeaders() {
        return {
            "Authorization": `OAuth ${this.accessToken}`
        };
    }
}

function fakeApiRequest(url, options) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 200,
                url: url,
                message: "Запит успішно виконано",
                usedHeaders: options.headers
            });
        }, 500);
    });
}

async function runDemo() {
    try {
        console.log("API Key авторизація");

        const apiKeyProxy = new AuthProxy(
            new ApiKeyAuth("my-secret-api-key")
        );

        const response1 = await apiKeyProxy.request("https://api.example.com/users", {
            method: "GET"
        });

        console.log("Відповідь сервера:", response1);

        console.log("JWT авторизація");

        apiKeyProxy.setAuthStrategy(
            new JwtAuth("jwt-token-12345")
        );

        const response2 = await apiKeyProxy.request("https://api.example.com/profile", {
            method: "POST",
            body: JSON.stringify({
                username: "Акакій"
            })
        });

        console.log("Відповідь сервера:", response2);

        console.log("OAuth авторизація");

        apiKeyProxy.setAuthStrategy(
            new OAuthAuth("oauth-access-token-67890")
        );

        const response3 = await apiKeyProxy.request("https://api.example.com/orders", {
            method: "GET"
        });

        console.log("Відповідь сервера:", response3);

    } catch (error) {
        console.log("Помилка:", error.message);
    }
}

runDemo();
