﻿namespace EventService.API.Entities;

public class EventGame
{
    public Guid GameId { get; set; }
    public bool PopUpItemsEnabled { get; set; } = false;
    public Guid? QuizzCollectionId { get; set; } = null;
}
