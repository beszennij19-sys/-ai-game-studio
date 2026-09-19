using UnityEditor;
using UnityEngine;
using UnityEngine.EventSystems;

public static class AIGameCompleteProjectBuilder
{
    [MenuItem("AI Game Studio/Create Complete Project From Blueprint")]
    public static void Build()
    {
        var root = new GameObject("AI_Game_Studio_Runtime");
        var bootstrap = root.AddComponent<AIGameStudioPipeline>();
        var save = root.AddComponent<AIGameSaveSystem>();

        var player = GameObject.CreatePrimitive(PrimitiveType.Capsule);
        player.name = "Player";
        player.transform.position = new Vector3(0, 1, 0);

        var ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
        ground.name = "GeneratedGround";
        ground.transform.localScale = Vector3.one * 5f;

        var cameraObject = new GameObject("Main Camera");
        var cam = cameraObject.AddComponent<Camera>();
        cameraObject.tag = "MainCamera";
        cameraObject.transform.position = new Vector3(0, 4, -7);
        cameraObject.transform.LookAt(player.transform);

        var light = new GameObject("Generated Light");
        var sun = light.AddComponent<Light>();
        sun.type = LightType.Directional;
        light.transform.rotation = Quaternion.Euler(50, -30, 0);

        if (Object.FindFirstObjectByType<EventSystem>() == null)
        {
            var es = new GameObject("EventSystem");
            es.AddComponent<EventSystem>();
        }

        Debug.Log("AI Game Studio 3.0: starter scene generated. Add generated art/content and build with Unity.");
        Selection.activeGameObject = root;
    }
}
