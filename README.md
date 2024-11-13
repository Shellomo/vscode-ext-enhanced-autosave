# Enhanced AutoSave for VS Code 💾

[//]: # ([![Visual Studio Marketplace Version]&#40;https://img.shields.io/visual-studio-marketplace/v/Shellomo.enhanced-autosave&#41;]&#40;https://marketplace.visualstudio.com/items?itemName=Shellomo.enhanced-autosave&#41;)

[//]: # ([![Visual Studio Marketplace Downloads]&#40;https://img.shields.io/visual-studio-marketplace/d/Shellomo.enhanced-autosave&#41;]&#40;https://marketplace.visualstudio.com/items?itemName=Shellomo.enhanced-autosave&#41;)

[//]: # ([![Visual Studio Marketplace Rating]&#40;https://img.shields.io/visual-studio-marketplace/r/Shellomo.enhanced-autosave&#41;]&#40;https://marketplace.visualstudio.com/items?itemName=Shellomo.enhanced-autosave&#41;)

[//]: # ([![GitHub]&#40;https://img.shields.io/github/license/Shellomo/vscode-ext-enhanced-autosave&#41;]&#40;https://github.com/Shellomo/vscode-ext-enhanced-autosave&#41;)

Never lose your work again! Enhanced AutoSave automatically saves your files and provides detailed metrics about your saving patterns and time saved.

[//]: # (![Demo GIF]&#40;images/demo.gif&#41;)

## ✨ Features

- 🚀 **Smart Automatic Saving**: Automatically saves your files when they're error-free
- 📊 **Detailed Analytics Dashboard**: Track your saving patterns and productivity
- ⚡ **Customizable Settings**: Adjust save delay and notifications to your preference
- 📈 **Comprehensive Metrics**:
  - Track daily, weekly, and monthly saves
  - Monitor time saved from manual saving
  - Analyze most frequently saved file types
  - Visualize peak productive hours
- 🎯 **Status Bar Integration**: Quick access to controls and metrics

## 📥 Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install Shellomo.enhanced-autosave`
4. Press Enter

Or install through the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Shellomo.enhanced-autosave)

## 🚀 Getting Started

1. The extension is enabled by default after installation
2. A status bar icon will appear showing the current status
3. Click the metrics button in the status bar to view your saving statistics
4. Customize settings to match your workflow (see Configuration section)

## ⚙️ Configuration

Customize the extension through VS Code settings:

```jsonc
{
    // Enable/disable auto-save functionality
    "enhancedAutosave.enabled": true,

    // Delay before saving (in milliseconds)
    "enhancedAutosave.debounceTime": 1000,

    // Show notifications when files are saved
    "enhancedAutosave.showNotifications": true
}
```

## 📊 Metrics Dashboard

View detailed statistics about your saving patterns:

- **Save Frequency**: Track how often files are automatically saved
- **Time Savings**: See how much time you've saved from manual saving
- **File Type Analysis**: Identify most frequently saved file types
- **Peak Hours**: Visualize your most productive hours
- **Trend Analysis**: Monitor your saving patterns over time

[//]: # (![Metrics Dashboard]&#40;images/metrics-dashboard.png&#41;)

## ⌨️ Keyboard Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| Toggle AutoSave | `Ctrl+Alt+S` | Enable/disable automatic saving |
| Show Metrics | `Ctrl+Alt+M` | Open the metrics dashboard |

## 🎯 Commands

Access these commands through the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `Enhanced AutoSave: Toggle AutoSave`
- `Enhanced AutoSave: Show Metrics`

## 🔄 Changelog

### Version 1.0.2
- Added visual charts to metrics dashboard
- Improved tracking of file types and peak hours
- Enhanced UI/UX for better user experience
- Fixed minor bugs and improved stability

[See full changelog](CHANGELOG.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- None currently. If you find any issues, please report them [here](https://github.com/Shellomo/vscode-ext-enhanced-autosave/issues)

## 💡 Feedback & Support

- 🌟 If you find this extension helpful, please consider giving it a [rating](https://marketplace.visualstudio.com/items?itemName=Shellomo.enhanced-autosave)
- 🐛 Found a bug? [Report it here](https://github.com/Shellomo/vscode-ext-enhanced-autosave/issues)
- 💭 Have a feature request? [Let us know](https://github.com/Shellomo/vscode-ext-enhanced-autosave/issues)
- 📧 Need help? [Contact support](mailto:your.email@example.com)

## 👨‍💻 About the Author

Created with ❤️ by [Shellomo](https://github.com/Shellomo)

---

**Enjoy coding with peace of mind! 🚀**