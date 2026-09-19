using UnityEngine;

public class AIGameRuntime : MonoBehaviour
{
    public static AIGameRuntime Instance { get; private set; }
    public string projectId = "PROJECT-3-0-DEMO";
    public int health = 100;
    public int coins;
    public int questProgress;

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void AddCoins(int amount) => coins += Mathf.Max(0, amount);
    public void Damage(int amount) => health = Mathf.Max(0, health - Mathf.Max(0, amount));
    public void Heal(int amount) => health = Mathf.Min(100, health + Mathf.Max(0, amount));
    public void AdvanceQuest(int amount = 1) => questProgress += Mathf.Max(0, amount);
}
