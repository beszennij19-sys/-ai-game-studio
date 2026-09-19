using UnityEditor;
using UnityEngine;

public static class AIGameStudio3_2Menu
{
    [MenuItem("AI Game Studio/3.2/Build Everything")]
    public static void BuildEverything()
    {
        AIGameAutomaticUnityExporter.ExportComplete();
        AIGameAutomaticUnityExporter.BuildScene();
        Debug.Log("AI Game Studio 3.2: Blueprint → Unity data → starter scene complete.");
    }
}
