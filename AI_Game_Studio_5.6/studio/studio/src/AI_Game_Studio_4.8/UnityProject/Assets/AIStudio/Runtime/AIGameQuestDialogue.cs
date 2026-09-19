using System;
using UnityEngine;
using UnityEngine.Events;

[Serializable]
public class AIGameQuest
{
    public string id;
    public string title;
    public string objective;
    public int required = 1;
    public int progress;
    public int rewardCoins = 100;
    public bool completed;
}

public class AIGameQuestManager : MonoBehaviour
{
    public AIGameQuest[] quests = Array.Empty<AIGameQuest>();
    public UnityEvent onQuestCompleted;

    public void AddProgress(string questId, int amount = 1)
    {
        foreach (var q in quests)
        {
            if (q.id != questId || q.completed) continue;
            q.progress += Mathf.Max(0, amount);
            if (q.progress >= q.required)
            {
                q.progress = q.required;
                q.completed = true;
                if (AIGameRuntime.Instance != null) AIGameRuntime.Instance.AddCoins(q.rewardCoins);
                onQuestCompleted?.Invoke();
            }
        }
    }
}

[Serializable]
public class AIGameDialogueChoice
{
    public string text;
    public string nextNodeId;
    public string consequence;
}

[Serializable]
public class AIGameDialogueNode
{
    public string id;
    public string speaker;
    public string text;
    public AIGameDialogueChoice[] choices = Array.Empty<AIGameDialogueChoice>();
}

public class AIGameDialogueRuntime : MonoBehaviour
{
    public AIGameDialogueNode[] nodes = Array.Empty<AIGameDialogueNode>();
    public string currentNodeId;

    public AIGameDialogueNode Current()
    {
        foreach (var n in nodes) if (n.id == currentNodeId) return n;
        return null;
    }

    public void SelectChoice(int index)
    {
        var node = Current();
        if (node == null || index < 0 || index >= node.choices.Length) return;
        currentNodeId = node.choices[index].nextNodeId;
        Debug.Log("Dialogue consequence: " + node.choices[index].consequence);
    }
}
