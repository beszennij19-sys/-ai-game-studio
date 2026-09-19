#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEngine;

public static class AIGameAssetImporter3_4
{
    [MenuItem("AI Game Studio/3.4/Import Generated Asset Pack")]
    public static void ImportGeneratedAssetPack()
    {
        var projectRoot = Directory.GetParent(Application.dataPath).FullName;
        var sourceRoot = Path.Combine(projectRoot, "..", "Studio", "generated-assets");
        if (!Directory.Exists(sourceRoot))
        {
            Debug.LogWarning("No Studio/generated-assets folder found. Generate assets on the Studio backend first.");
            return;
        }
        var targetRoot = Path.Combine(Application.dataPath, "AIStudio", "Generated");
        Directory.CreateDirectory(targetRoot);
        foreach (var file in Directory.GetFiles(sourceRoot, "*", SearchOption.AllDirectories))
        {
            if (!file.EndsWith(".png", System.StringComparison.OrdinalIgnoreCase)) continue;
            var relative = file.Substring(sourceRoot.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            var target = Path.Combine(targetRoot, relative);
            Directory.CreateDirectory(Path.GetDirectoryName(target));
            File.Copy(file, target, true);
        }
        AssetDatabase.Refresh();
        Debug.Log("AI Game Studio 3.4: generated PNG assets imported into Assets/AIStudio/Generated.");
    }
}
#endif
