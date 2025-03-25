public void Nevigate(RectTransform item)
{
    Vector3 itemCurrentLocalPostion = scrollRect.GetComponent<RectTransform>().InverseTransformVector(ConvertLocalPosToWorldPos(item));
    Vector3 itemTargetLocalPos = scrollRect.GetComponent<RectTransform>().InverseTransformVector(ConvertLocalPosToWorldPos(viewport));
    Vector3 diff = itemTargetLocalPos - itemCurrentLocalPostion;
    diff.z = 0f;

    var newNormalizedPosition = new Vector2(
        diff.x / (content.GetComponent<RectTransform>().rect.width - viewport.rect.width),
        diff.y / (content.GetComponent<RectTransform>().rect.height - viewport.rect.height)
    );

    newNormalizedPosition = scrollRect.normalizedPosition + newNormalizedPosition;
    newNormalizedPosition.x = Mathf.Clamp01(newNormalizedPosition.x);
    newNormalizedPosition.y = Mathf.Clamp01(newNormalizedPosition.y);

    scrollRect.normalizedPosition = newNormalizedPosition;
}

public void ConvertLocalPosToWorldPos(RectTransform target)
{
    var pivotOffset = new Vector3((0.5f - target.pivot.x) * target.rect.size.x, (0.5f - target.pivot.y) * target.rect.size.y, 0);
    var localPosition = target.localPosition + pivotOffset;
    return target.parent.TransformPoint(localPosition)
}