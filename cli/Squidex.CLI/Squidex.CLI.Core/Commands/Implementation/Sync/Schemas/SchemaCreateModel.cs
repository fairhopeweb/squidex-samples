﻿// ==========================================================================
//  Squidex Headless CMS
// ==========================================================================
//  Copyright (c) Squidex UG (haftungsbeschraenkt)
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using Squidex.ClientLibrary;

namespace Squidex.CLI.Commands.Implementation.Sync.Schemas;

internal class SchemaCreateModel
{
    public string Name { get; set; }

    public bool IsSingleton { get; set; }

    public SchemaType SchemaType { get; set; }
}
