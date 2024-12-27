# Первая стадия: сборка
FROM node:latest AS builder
WORKDIR /app

# Копируем только необходимые файлы для установки зависимостей
COPY package.json package-lock.json* ./
RUN npm install

# Копируем весь исходный код
COPY . .

# Собираем проект (если требуется)
RUN npm run build

# Вторая стадия: создание минимального конечного образа
FROM node:alpine
WORKDIR /app

# Копируем только собранные файлы из стадии сборки
COPY --from=builder /app .

# Устанавливаем только production-зависимости
RUN npm install --production

EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]
