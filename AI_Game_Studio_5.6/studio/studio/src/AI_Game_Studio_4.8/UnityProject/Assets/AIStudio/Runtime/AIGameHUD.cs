using UnityEngine;
using UnityEngine.UI;

public class AIGameHUD : MonoBehaviour
{
    public Text healthText;
    public Text coinsText;
    public Text questText;

    void Update()
    {
        if (AIGameRuntime.Instance == null) return;
        if (healthText) healthText.text = "HP: " + AIGameRuntime.Instance.health;
        if (coinsText) coinsText.text = "Coins: " + AIGameRuntime.Instance.coins;
        if (questText) questText.text = "Quest: " + AIGameRuntime.Instance.questProgress;
    }
}

public class AIGameSafeArea : MonoBehaviour
{
    RectTransform rect;
    Rect last;

    void Awake() { rect = transform as RectTransform; }

    void Update()
    {
        if (rect == null || last == Screen.safeArea) return;
        last = Screen.safeArea;
        Vector2 min = last.position;
        Vector2 max = last.position + last.size;
        min.x /= Screen.width; min.y /= Screen.height;
        max.x /= Screen.width; max.y /= Screen.height;
        rect.anchorMin = min; rect.anchorMax = max;
        rect.offsetMin = rect.offsetMax = Vector2.zero;
    }
}
