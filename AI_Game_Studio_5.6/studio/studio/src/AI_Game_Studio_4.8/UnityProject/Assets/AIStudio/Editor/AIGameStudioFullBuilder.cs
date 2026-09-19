using UnityEditor;
using UnityEngine;
using UnityEngine.EventSystems;

public static class AIGameStudioFullBuilder
{
    [MenuItem("AI Game Studio/Build Complete Game")]
    public static void BuildCompleteGame()
    {
        if (Object.FindFirstObjectByType<AIGameRuntime>() != null)
        {
            Debug.Log("AI Game Studio: runtime already exists.");
            return;
        }

        var root = new GameObject("AI_Game_Studio_Runtime");
        var runtime = root.AddComponent<AIGameRuntime>();
        var save = root.AddComponent<AIGameSaveSystem>();
        save.projectId = runtime.projectId;

        var player = GameObject.CreatePrimitive(PrimitiveType.Capsule);
        player.name = "Player";
        player.transform.position = new Vector3(0, 1, 0);
        player.AddComponent<AIGamePlayerController>();

        var ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
        ground.name = "GeneratedWorld";
        ground.transform.localScale = Vector3.one * 5f;

        var camObj = new GameObject("Main Camera");
        var cam = camObj.AddComponent<Camera>();
        camObj.tag = "MainCamera";
        camObj.transform.position = new Vector3(0, 4, -7);
        camObj.transform.LookAt(player.transform);

        var lightObj = new GameObject("Generated Sun");
        var light = lightObj.AddComponent<Light>();
        light.type = LightType.Directional;
        lightObj.transform.rotation = Quaternion.Euler(50, -30, 0);

        if (Object.FindFirstObjectByType<EventSystem>() == null)
            new GameObject("EventSystem", typeof(EventSystem));

        AssetDatabase.SaveAssets();
        Debug.Log("AI Game Studio 3.0 FULL: starter game scene generated.");
        Selection.activeGameObject = root;
    }

    [MenuItem("AI Game Studio/Validate Project Data")]
    public static void Validate()
    {
        string path = Application.dataPath + "/AIStudio/Data";
        string[] required = {
            "Blueprint.json","Gameplay.json","World.json","NPCs.json",
            "Quests.json","QuestGraph.json","UIDesign.json","ControlScheme.json"
        };
        int missing = 0;
        foreach (var f in required)
        {
            if (!System.IO.File.Exists(System.IO.Path.Combine(path, f)))
            {
                Debug.LogError("Missing: " + f);
                missing++;
            }
        }
        Debug.Log(missing == 0
            ? "AI Game Studio: all required data files are present."
            : "AI Game Studio: validation found missing files: " + missing);
    }
}
