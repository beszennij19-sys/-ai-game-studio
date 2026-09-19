using System; using UnityEngine;
namespace AIGameStudio { [Serializable] public class GameplayFeatures49 { public bool combat,inventory,crafting,building,quests,dialogue,vehicles,enemies,mobileControls; }
[Serializable] public class GameplayRuntime49Data { public string version; public string projectId; public string genre; public string camera; public GameplayFeatures49 features; public int enemyCount; public int pickupCount; }
public class AIGameGameplayCompiler49 : MonoBehaviour { public GameplayRuntime49Data data; public void Load(string json){ data=JsonUtility.FromJson<GameplayRuntime49Data>(json); } public bool HasCombat(){return data!=null&&data.features!=null&&data.features.combat;} public bool HasInventory(){return data!=null&&data.features!=null&&data.features.inventory;} }
}
