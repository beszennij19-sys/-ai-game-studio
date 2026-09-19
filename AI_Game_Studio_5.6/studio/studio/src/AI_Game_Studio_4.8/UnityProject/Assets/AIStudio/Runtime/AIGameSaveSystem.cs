using System;
using System.IO;
using UnityEngine;

[Serializable]
public class AIGameSaveData
{
    public string projectId;
    public int health = 100;
    public int coins;
    public int questProgress;
    public string currentQuestId;
    public string currentDialogueNode;
}

public class AIGameSaveSystem : MonoBehaviour
{
    public string projectId = "PROJECT-3-0-DEMO";
    public bool autoSave = true;
    public float intervalSeconds = 30f;
    float timer;

    string SavePath => Path.Combine(Application.persistentDataPath, "ai_game_" + projectId + ".json");

    void Update()
    {
        if (!autoSave) return;
        timer += Time.deltaTime;
        if (timer >= intervalSeconds) { timer = 0; Save(); }
    }

    public void Save()
    {
        var r = AIGameRuntime.Instance;
        var d = new AIGameSaveData { projectId = projectId };
        if (r != null) { d.health = r.health; d.coins = r.coins; d.questProgress = r.questProgress; }
        try { File.WriteAllText(SavePath, JsonUtility.ToJson(d, true)); }
        catch (Exception e) { Debug.LogError("Save failed: " + e.Message); }
    }

    public void Load()
    {
        if (!File.Exists(SavePath)) return;
        try
        {
            var d = JsonUtility.FromJson<AIGameSaveData>(File.ReadAllText(SavePath));
            if (d.projectId != projectId) return;
            if (AIGameRuntime.Instance != null)
            {
                AIGameRuntime.Instance.health = d.health;
                AIGameRuntime.Instance.coins = d.coins;
                AIGameRuntime.Instance.questProgress = d.questProgress;
            }
        }
        catch (Exception e) { Debug.LogError("Load failed: " + e.Message); }
    }

    void OnApplicationPause(bool pause) { if (pause) Save(); }
    void OnApplicationQuit() => Save();
}
