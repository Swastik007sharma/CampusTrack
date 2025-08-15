# 🤝 Contributing to Lost & Found

Thank you for showing interest in contributing to **Lost & Found - College Cornerstone Project**! 🎉

We welcome contributions from everyone — whether it’s fixing bugs, improving documentation, or building new features.

---

## 📋 Code of Conduct

By participating in this project, you agree to uphold our community values:

* Be respectful and inclusive 💙
* Help others learn and grow 📚
* No harassment, discrimination, or disrespect 🚫

---

## 🛠️ How to Contribute

### 1. Fork the Repository 🍴

Click the **Fork** button at the top right of this repo to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/Lost_And_Found.git
cd Lost_And_Found
```

### 3. Create a Branch 🌿

```bash
git checkout -b feature/YourFeatureName
```

### 4. Make Your Changes ✏️

* Follow the existing code style and folder structure.
* Add/update comments where needed.
* Keep commits atomic and descriptive.

### 5. Commit Changes 💾

```bash
git add .
git commit -m "feat: Add new feature for XYZ"
```

### 6. Push to Your Fork ⬆️

```bash
git push origin feature/YourFeatureName
```

### 7. Create a Pull Request 🔄

* Go to the main repo and click **New Pull Request**.
* Provide a clear title and description.
* Mention any related issues using `#issue_number`.

---

## 🧪 Testing Your Changes

Before submitting your PR:

* Ensure backend runs without errors: `npm run dev` in `/backend`
* Ensure frontend builds and runs correctly: `npm run dev` in `/frontend`
* Test Docker setup if relevant: `docker-compose up --build`

---

## 🗂️ Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

* `feat:` for new features ✨
* `fix:` for bug fixes 🐛
* `docs:` for documentation changes 📄
* `style:` for formatting/style changes 🎨
* `refactor:` for code restructuring 🛠️
* `test:` for adding/modifying tests 🧪
* `chore:` for maintenance tasks 🔧

Example:

```bash
git commit -m "feat: Add image upload feature for lost items"
```

---

## 🧾 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---
