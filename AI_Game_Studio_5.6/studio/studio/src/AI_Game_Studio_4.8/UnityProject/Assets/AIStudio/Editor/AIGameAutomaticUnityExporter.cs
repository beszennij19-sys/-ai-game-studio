using UnityEditor;
using UnityEngine;
using System.IO;
using System.Collections.Generic;

public static class AIGameAutomaticUnityExporter
{
    const string DataPath = "Assets/AIStudio/Data";

    [MenuItem("AI Game Studio/3.2/Export Complete Unity Project")]
    public static void ExportComplete()
    {
        EnsureFolders();
        string blueprintPath = Path.Combine(Application.dataPath, "AIStudio/Data/Blueprint.json");

        if (!File.Exists(blueprintPath))
        {
            Debug.LogError("AI Game Studio: Blueprint.json not found.");
            return;
        }

        string blueprint = File.ReadAllText(blueprintPath);
        string projectId = ExtractString(blueprint, "projectId", "PROJECT-UNKNOWN");

        WriteDerived("Gameplay.json", BuildGameplay(projectId, blueprint));
        WriteDerived("World.json", Wrap(projectId, "world"));
        WriteDerived("NPCs.json", BuildNpcData(projectId, blueprint));
        WriteDerived("Quests.json", BuildQuestData(projectId, blueprint));
        WriteDerived("QuestGraph.json", BuildQuestGraph(projectId, blueprint));
        WriteDerived("UIDesign.json", BuildUi(projectId, blueprint));
        WriteDerived("ControlScheme.json", BuildControls(projectId));
        WriteDerived("UnityExportManifest.json",
            "{\n  \"pipelineVersion\":\"3.2\",\n  \"projectId\":\"" + Escape(projectId) +
            "\",\n  \"status\":\"exported\"\n}");

        AssetDatabase.Refresh();
        Debug.Log("AI Game Studio 3.2: exported all Unity data for " + projectId);
    }

    [MenuItem("AI Game Studio/3.2/Build Complete Starter Scene")]
    public static void BuildScene()
    {
        AIGameStudioFullBuilder.BuildCompleteGame();
        Debug.Log("AI Game Studio 3.2: starter Unity scene built from exported data.");
    }

    static void EnsureFolders()
    {
        Directory.CreateDirectory(Application.dataPath + "/AIStudio/Data");
        Directory.CreateDirectory(Application.dataPath + "/AIStudio/Runtime");
        Directory.CreateDirectory(Application.dataPath + "/AIStudio/Editor");
    }

    static void WriteDerived(string file, string content)
    {
        File.WriteAllText(Path.Combine(Application.dataPath, "AIStudio/Data", file), content);
    }

    static string BuildGameplay(string id, string bp) =>
        "{\n\"projectId\":\"" + Escape(id) +
        "\",\n\"playerMode\":\"" + ExtractString(bp,"playerMode","solo") +
        "\",\n\"networking\":\"" + ExtractString(bp,"networking","offline") + "\"\n}";

    static string BuildNpcData(string id, string bp) =>
        "{\n\"projectId\":\"" + Escape(id) + "\",\n\"npcs\":[]\n}";

    static string BuildQuestData(string id, string bp) =>
        "{\n\"projectId\":\"" + Escape(id) + "\",\n\"quests\":[]\n}";

    static string BuildQuestGraph(string id, string bp) =>
        "{\n\"projectId\":\"" + Escape(id) + "\",\n\"nodes\":[],\"edges\":[]\n}";

    static string BuildUi(string id, string bp) =>
        "{\n\"projectId\":\"" + Escape(id) +
        "\",\n\"profile\":\"" + Escape(ExtractString(bp,"genre","adventure")) +
        "\",\n\"mobileFirst\":true\n}";

    static string BuildControls(string id) =>
        "{\n\"projectId\":\"" + Escape(id) +
        "\",\n\"mobile\":[\"joystick\",\"look\",\"action\",\"interact\"],\"desktop\":[\"WASD\",\"mouse\",\"Space\",\"E\"]\n}";

    static string Wrap(string id, string key) =>
        "{\n\"projectId\":\"" + Escape(id) + "\",\n\"" + key + "\":{}\n}";

    static string ExtractString(string json, string key, string fallback)
    {
        string token = "\"" + key + "\"";
        int i = json.IndexOf(token);
        if (i < 0) return fallback;
        i = json.IndexOf(':', i);
        if (i < 0) return fallback;
        i++;
        while (i < json.Length && char.IsWhiteSpace(json[i])) i++;
        if (i >= json.Length || json[i] != '"') return fallback;
        i++;
        int e = json.IndexOf('"', i);
        return e > i ? json.Substring(i, e-i) : fallback;
    }

    static string Escape(string s) => (s ?? "").Replace("\\","\\\\").Replace("\"","\\\"");
}
