#if UNITY_EDITOR
using System;
using System.IO;
using UnityEditor;
using UnityEngine;

public static class AIGameAssetGenerator33
{
    [MenuItem("AI Game Studio/3.3/Generate Asset Pack")]
    public static void GenerateAssetPack()
    {
        var source = Path.Combine(Application.dataPath, "AIStudio/Data/assets/AssetManifest.json");
        if (!File.Exists(source)) { Debug.LogError("3.3: AssetManifest.json not found."); return; }
        var json = File.ReadAllText(source);
        var root = Path.Combine(Application.dataPath, "AIStudio/Generated");
        Directory.CreateDirectory(root);
        var projectId = Extract(json, "projectId") ?? "UNKNOWN_PROJECT";
        var projectRoot = Path.Combine(root, projectId);
        Directory.CreateDirectory(projectRoot);
        foreach (var folder in new[]{"Art","Characters","Environment","Props","UI","Audio","VFX"}) Directory.CreateDirectory(Path.Combine(projectRoot, folder));
        File.WriteAllText(Path.Combine(projectRoot, "AssetManifest.json"), json);
        AssetDatabase.Refresh();
        Debug.Log($"AI Game Studio 3.3: asset pack prepared for {projectId}. Generation files are provider-dependent.");
    }
    static string Extract(string json, string key)
    {
        var token = "\"" + key + "\"";
        var i = json.IndexOf(token, StringComparison.Ordinal); if (i < 0) return null;
        i = json.IndexOf(':', i) + 1; while (i < json.Length && char.IsWhiteSpace(json[i])) i++;
        if (i >= json.Length || json[i] != '\"') return null; i++;
        var e = json.IndexOf('"', i); return e > i ? json.Substring(i, e-i) : null;
    }
}
#endif
